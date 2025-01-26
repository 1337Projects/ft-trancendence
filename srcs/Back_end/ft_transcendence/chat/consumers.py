
import json, math
from .serializers import *
from login.models import *
from django.db.models import Q
from account.serializer import *
from account.models import Friends
from asgiref.sync import sync_to_async
from .models import Conversation, Message
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.core.paginator import Paginator, EmptyPage
from channels.generic.websocket import AsyncWebsocketConsumer


channel_name_grp = {}

class PrivateChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        if isinstance(self.scope['user'], AnonymousUser):
            await self.close()
            return
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        for key, value in channel_name_grp.items():
            if channel_name_grp[key] == str(self.user_id):
                channel_name_grp[value] = self.channel_name
                await self.accept()
                return
        channel_name_grp.update({ self.user_id : self.channel_name})
        await self.accept()
        
    @database_sync_to_async
    def check_if_blocked (self, sender, receiver):
        freindship = Friends.objects.filter(
            Q(sender=sender, receiver=receiver) |
            Q(sender=receiver, receiver=sender)
        ).first()
        if freindship and freindship.status == "blocked":
            return 1

    @database_sync_to_async
    def get_messages_between_users(self, sender_id, receiver_id):
        messages = list(Message.objects.filter(
            (Q(sender_id=sender_id) & Q(receiver_id=receiver_id)) |
            (Q(sender_id=receiver_id) & Q(receiver_id=sender_id))
        ).order_by('-created_at'))
        nbr_msgs = len(messages)
        return messages

    @database_sync_to_async
    def get_freindship(self, sender, receiver):
        freindship = Friends.objects.filter(
            Q(sender=sender, receiver=receiver) |
            Q(sender=receiver, receiver=sender)
        ).first()
        return UserWithFriendsSerializer(freindship).data

    @database_sync_to_async
    def add_users_to_group(self, sender_id, receiver_id):
        tmp_user_id, tmp_partner_id = sorted([sender_id, receiver_id])
        room_name = f'chat_{tmp_user_id}_{tmp_partner_id}'
        room_group_name = room_name.replace(" ", "_")

        sender_channel = channel_name_grp.get(str(sender_id))
        receiver_channel = channel_name_grp.get(str(receiver_id))

        return room_group_name, sender_channel, receiver_channel

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

    @database_sync_to_async
    def get_sender_and_receiver(self, from_, to_):
        try:
            sender = User.objects.get(username=from_)
            receiver = User.objects.get(username=to_)
        except User.DoesNotExist:
            return 'user not found' , 'user not found' ,'user not found' , 'user not found'
        sender_ser = UserWithProfileSerializer(sender).data
        receiver_ser = UserWithProfileSerializer(receiver).data
        return sender, receiver, sender_ser, receiver_ser

    async def send_message(self, event):
        link = event['link']
        if link != None:
            the_type = 'game_invite'
        else:
            the_type = 'new_message'
        await self.send(text_data=json.dumps({
            'response': {
                'event': "new_message",
                'type': the_type,
                'status': 205,
                'message': event['message'],
                'receiver': event['receiver'],
                'sender': event['sender'],
                'conversation': event['conversation'],
            }
        }))

    async def fetch_conversations(self):
        try:
            conversations = await self.get_conversations(self.user_id)
            await self.send(text_data=json.dumps({
                'response': {
                    'event': 'fetch_conversations',
                    'status': 209,
                    'conversations': conversations,
                }
            }))
        except Exception as e:
            await self.send(text_data=json.dumps({
                'response': {
                    'error': f'Error in fetch conversations {e}',
                    'status': 400,
                }
            }))
    
    async def fetch_messages(self,text_data_json):
        try:
            to_ = text_data_json.get('partner')
            from_ = text_data_json.get('from')
            page_ = text_data_json.get('page')
            sender, receiver, sender_ser, receiver_ser = await self.get_sender_and_receiver(from_, to_)
            all_messages = await self.get_messages_between_users(sender_ser['id'], receiver_ser['id'])
            page = text_data_json.get('page', 1)
            limit = text_data_json.get('limit', 30)
            paginator = Paginator(all_messages, limit)
            try:
                messages = paginator.page(page)
            except EmptyPage:
                messages = []
            serialized_messages = [await self.serialize_message(message) for message in messages]
            nbr_msgs = len(all_messages)
            nbr_pages = math.ceil(nbr_msgs/limit)
            freindship_ser = await self.get_freindship(sender, receiver)
            await self.send(text_data=json.dumps({
                'response': {
                    'status': 206,
                    'messages': serialized_messages,
                    'user': receiver_ser,
                    'nbr_pages': nbr_pages,
                    'freindship' : freindship_ser,
                    'page' : page_
                }
            }))
        except Exception as e:
            await self.send(text_data=json.dumps({
                'response': {
                    'error': f'Error in fetch messages {e}',
                    'status' : 400,
                }
            }))

    async def create_message(self, sender, receiver, message_content, conversation, link):
        message = await sync_to_async(Message.objects.create)(
            message=message_content,
            sender=sender,
            receiver=receiver,
            conversation=conversation,
            link=link,
        )
        conversation.content_of_last_message = message.message
        conversation.last_message_time = message.created_at
        await sync_to_async(conversation.save)()
        return message

    async def new_message(self, text_data_json):
        try:
            link = text_data_json.get('link')
            message_content = text_data_json.get('content')
            from_ = text_data_json.get('from')
            to_ = text_data_json.get('partner')
            sender, receiver, sender_ser, receiver_ser = await self.get_sender_and_receiver(from_, to_)
            if not sender or not receiver:
                await self.send(text_data=json.dumps({
                    'response': {
                        'error': 'user not found',
                        'status' : 400,
                    }
                }))
                return
            if (await self.check_if_blocked(sender, receiver)) == True:
                await self.send(text_data=json.dumps({
                    'response': {
                        'error': 'There is a blocked relationship',
                        'status' : 400
                    }
                }))
                return
            conversation = await self.get_or_create_conversation(sender, receiver)
            message = await self.create_message(sender, receiver, message_content, conversation, link)
            message_ser = await self.serialize_message(message)
            message_ser['sender'] = sender_ser
            message_ser['receiver'] = receiver_ser
            conversation_ser = await self.serialize_conversation(conversation)
            room_group_name, sender_channel, receiver_channel = await self.add_users_to_group(sender_ser['id'], receiver_ser['id'])
            self.room_group_name = room_group_name
            if sender_channel:
                await self.channel_layer.group_add(self.room_group_name, sender_channel)
            if receiver_channel:
                await self.channel_layer.group_add(self.room_group_name, receiver_channel)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_message',
                    'message': message_ser,
                    'status': 205,
                    'receiver': receiver_ser,
                    'sender': sender_ser,
                    'conversation': conversation_ser,
                    'link' :link,
                }
            )
        except Exception as e:
            await self.send(text_data=json.dumps({
                'response': {
                    'error': f'Error in new message {e}',
                    'status' : 400,
                }
            }))


    async def receive(self, text_data=None):
        try :
            text_data_json = json.loads(text_data)
            event = text_data_json.get('event')
            if event == "fetch_conversations":
                await self.fetch_conversations()
            elif event == "fetch_messages":
                await self.fetch_messages(text_data_json)
            elif event == 'new_message':
                await self.new_message(text_data_json)
        except Exception as e:
            await self.send(text_data=json.dumps({
                'response': {
                    'error': f'Error in new message {e}',
                    'status' : 400,
                }
            }))

