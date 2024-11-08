
import json
import sys
from .serializers import *
from login.models import *
from django.db.models import Q
from account.serializer import *
from asgiref.sync import sync_to_async
from login.serializer import UserSerializer
from channels.db import database_sync_to_async
from chat.models import Message , Conversation
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.paginator import Paginator, EmptyPage
from .models import Conversation, Message
from rest_framework import status



@database_sync_to_async
def get_user_with_profile(username):
    user = User.objects.get(username=username)
    profile = Profile.objects.get(user_id=user.id)
    user_ser = UserWithProfileSerializer(user).data
    user_ser['profile'] = ProfileSerializers(profile).data
    return user_ser


# def get_messages_between_users(sender_id, receiver_id):
#     messages = Message.objects.filter(
#         (Q(sender_id=sender_id) & Q(receiver_id=receiver_id)) |
#         (Q(sender_id=receiver_id) & Q(receiver_id=sender_id))
#     ).order_by('created_at')
    
#     return MessageSerializer(messages, many=True).data 

#comment it to try pagiantion and uncomment th next 
@database_sync_to_async
def get_messages_between_users(sender_id, receiver_id):
    messages = list(Message.objects.filter(
        (Q(sender_id=sender_id) & Q(receiver_id=receiver_id)) |
        (Q(sender_id=receiver_id) & Q(receiver_id=sender_id))
    ).order_by('created_at')) #for pagination add -
    # print(sender_id, receiver_id, "*******\n" ,messages)
    return messages

channel_name_grp = []

class PrivateChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        for item in channel_name_grp:
            if str(self.user_id) in item[0]:
                await self.accept()
                return
        channel_name_grp.append((self.user_id, self.channel_name))
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
        return ConversationListSerializer(conversations_list, many=True).data

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
        serialized_messages = [await self.serialize_message(msg) for msg in all_messages]
        await self.send(text_data=json.dumps({
            'response': {
                'status': 206,
                'messages': serialized_messages,
                'user': receiver_ser,
            }
        }))

    async def new_message(self,text_data_json):
        message_content = text_data_json.get('content')
        from_ = text_data_json.get('from')
        to_ = text_data_json.get('partner')
        try:
            sender = await sync_to_async(User.objects.get)(username=from_)
            receiver = await sync_to_async(User.objects.get)(username=to_)
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
            print(e, "ok i see")
            sys.stdout.flush()
            return
        tmp_user_id, tmp_partner_id = sorted([sender_ser['id'], receiver_ser['id']])
        self.room_name = f'chat_{tmp_user_id}_{tmp_partner_id}'
        self.room_group_name = self.room_name.replace(" ", "_")
        # for user_ser in [sender_ser, receiver_ser]:
        #     channel_name = next(item[1] for item in channel_name_grp if str(user_ser['id']) in item[0])
        #     await self.channel_layer.group_add(self.room_group_name, channel_name)

        channel_name = None
        for item in channel_name_grp:
            if str(sender_ser['id']) in item[0]:
                channel_name = item[1]
                break
        await self.channel_layer.group_add(
            self.room_group_name,
            channel_name,
        )

        for item in channel_name_grp:
            if str(receiver_ser['id']) in item[0]:
                channel_name = item[1]
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

    async def receive(self, text_data=None):
        text_data_json = json.loads(text_data)
        event = text_data_json.get('event')
        if event == "fetch_conversations":
            await self.fetch_conversations()
        elif event == "fetch_messages":
            await self.fetch_messages(text_data_json)
        elif event == 'new_message':
            await self.new_message(text_data_json)
                

