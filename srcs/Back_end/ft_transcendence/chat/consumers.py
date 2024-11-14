
import json , sys, math
from .serializers import *
from login.models import *
from django.db.models import Q
from account.serializer import *
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.paginator import Paginator, EmptyPage
from .models import Conversation, Message

@database_sync_to_async
def get_user_with_profile(username):
    user = User.objects.get(username=username)
    profile = Profile.objects.get(user_id=user.id)
    user_ser = UserWithProfileSerializer(user).data
    user_ser['profile'] = ProfileSerializers(profile).data
    return user_ser

@database_sync_to_async
def get_messages_between_users(sender_id, receiver_id):
    messages = list(Message.objects.filter(
        (Q(sender_id=sender_id) & Q(receiver_id=receiver_id)) |
        (Q(sender_id=receiver_id) & Q(receiver_id=sender_id))
    ).order_by('-created_at'))
    nbr_msgs = len(messages)
    return messages

@database_sync_to_async
def check_if_blocked(blocker_id, blocked_id):
    is_blocked = BlockedUser.objects.filter(
        Q(blocker_id=blocker_id, blocked_id=blocked_id) |
        Q(blocker_id=blocked_id, blocked_id=blocker_id)
    )
    return is_blocked.exists()

channel_name_grp = {}

class PrivateChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        for key, value in channel_name_grp.items():
            if channel_name_grp[key] == str(self.user_id):
                channel_name_grp[value] = self.channel_name
                await self.accept()
                return
        channel_name_grp.update({ self.user_id : self.channel_name})
        await self.accept()

    async def send_message(self, event):
        await self.send(text_data=json.dumps({
            'response': {
                'event': "new_message",
                'status': 205,
                'message': event['message'],
                'receiver': event['receiver'],
                'sender': event['sender'],
                'conversation': event['conversation'],
            }
        }))
        
    @database_sync_to_async
    def save_message(self, message):
        message.save()

    @database_sync_to_async
    def get_or_create_conversation(self, sender, receiver):
        conversation = Conversation.objects.filter(
            Q(sender=sender, receiver=receiver) |
            Q(sender=receiver, receiver=sender)
        ).first()
        if not conversation:
            conversation = Conversation.objects.create(sender=sender, receiver=receiver)
        return conversation

    @database_sync_to_async
    def serialize_message(self, message):
        return MessageSerializer(message).data

    @database_sync_to_async
    def serialize_conversation(self, conversation):
        return ConversationSerializer(conversation).data

    @database_sync_to_async
    def get_conversations(self,user_id):
        conversations_list = list(Conversation.objects.filter(Q(sender=user_id) | Q(receiver=user_id)))
        return ConversationSerializer(conversations_list, many=True).data

    async def fetch_conversations(self):
        conversations = await self.get_conversations(self.user_id)
        await self.send(text_data=json.dumps({
            'response': {
                'event': 'fetch_conversations',
                'status': 209,
                'conversations': conversations,
            }
        }))
    
    async def fetch_messages(self,text_data_json):
        to_ = text_data_json.get('partner')
        from_ = text_data_json.get('from')
        sender_ser = await get_user_with_profile(from_)
        receiver_ser = await get_user_with_profile(to_)
        all_messages = await get_messages_between_users(sender_ser['id'], receiver_ser['id'])
        for message in all_messages:
            message.seen = True
            await sync_to_async(message.save)()
        page = text_data_json.get('page', 1)
        limit = text_data_json.get('limit', 10)
        paginator = Paginator(all_messages, limit)
        try:
            messages = paginator.page(page)
        except EmptyPage:
            messages = []
        serialized_messages = [await self.serialize_message(message) for message in messages]
        nbr_msgs = len(all_messages)
        nbr_pages = math.ceil(nbr_msgs/limit)
        await self.send(text_data=json.dumps({
            'response': {
                'status': 206,
                'messages': serialized_messages,
                'user': receiver_ser,
                'nbr_pages': nbr_pages,
            }
        }))

    async def new_message(self,text_data_json):
        message_content = text_data_json.get('content')
        from_ = text_data_json.get('from')
        to_ = text_data_json.get('partner')
        try:
            sender = await sync_to_async(User.objects.get)(username=from_)
            receiver = await sync_to_async(User.objects.get)(username=to_)
            if (await check_if_blocked(sender.id, receiver.id)) == True:
                await self.send(text_data=json.dumps({
                    'error': 'you are blocked'
                }))
                return
        except User.DoesNotExist:
            await self.send(text_data=json.dumps({
                'error': 'user not found'
            }))
            return
        sender_ser = await get_user_with_profile(from_)
        receiver_ser = await get_user_with_profile(to_)
        conversation = await self.get_or_create_conversation(sender, receiver)

        message = await sync_to_async(Message.objects.create)(
            message=message_content,
            sender=sender,
            receiver=receiver,
            conversation=conversation
        )
        conversation.content_of_last_message = message.message
        conversation.last_message_time = message.created_at
        await sync_to_async(conversation.save)()

        message_ser = await self.serialize_message(message)
        message_ser['sender'] = sender_ser
        message_ser['receiver'] = receiver_ser

        try:
            conversation_ser = await self.serialize_conversation(conversation)
        except Exception as e:
            await self.send(text_data=json.dumps({
                'error': 'Error serializing conversation'
            }))
            return
        tmp_user_id, tmp_partner_id = sorted([sender_ser['id'], receiver_ser['id']])
        self.room_name = f'chat_{tmp_user_id}_{tmp_partner_id}'
        self.room_group_name = self.room_name.replace(" ", "_")

        channel_name = None
        for key, value in channel_name_grp.items():
            if str(sender_ser['id']) == key:
                channel_name = value
                break
        await self.channel_layer.group_add(
            self.room_group_name,
            channel_name,
        )
        for key, value in channel_name_grp.items():
            if str(receiver_ser['id']) == key:
                channel_name = value
                break
        await self.channel_layer.group_add(
            self.room_group_name,
            channel_name,
        )
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send_message',
                'message': message_ser,
                'status': 205,
                'receiver': receiver_ser,
                'sender': sender_ser,
                'conversation': conversation_ser,
            }
        )

    async def seen_message(self,text_data_json):
        # conversation_id = text_data_json.get('conversation_id')
        # print("hello")
        # sys.stdout.flush()
        # conversation = await sync_to_async(Conversation.objects.get)(id=conversation_id)
        # print("hello2")
        # sys.stdout.flush()
        # messages = conversation.messages.all()
        # print("hello3")
        # sys.stdout.flush()
        # for message in messages:
        #     print("message is :", message)
        #     sys.stdout.flush()
        #     message.seen = True
        #     await sync_to_async(message.save)()

        #or you can use
        sender_id = text_data_json.get('sender_id')
        receiver_id = text_data_json.get('receiver_id')
        all_messages = await get_messages_between_users(sender_id, receiver_id)
        for message in all_messages:
            message.seen = True
            await sync_to_async(message.save)()

    
        #khassni l id dyalo bach nl9a smyto f channel_name_grp so i can send him the event
        # for key, value in channel_name_grp.items():
        #     if str(id_receiver) == key:
        #         channel_name = value
        #         break
        # await self.channel_layer.group_add(
        #     self.room_group_name,
        #     channel_name,
        # )
        await self.send(text_data=json.dumps({
            'response': {
                'event': 'seen_message',
                'status': 212,
            }
        }))


    async def receive(self, text_data=None):
        # print("text data", text_data)
        sys.stdout.flush()
        text_data_json = json.loads(text_data)
        event = text_data_json.get('event')
        if event == "fetch_conversations":
            await self.fetch_conversations()
        elif event == "fetch_messages":
            await self.fetch_messages(text_data_json)
        elif event == 'new_message':
            await self.new_message(text_data_json)
        elif event == 'seen_messages':
            await self.seen_message(text_data_json)
                

