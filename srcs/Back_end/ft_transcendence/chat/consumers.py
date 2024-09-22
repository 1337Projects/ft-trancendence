
import json
from .serializers import *
from login.models import User
from django.db.models import Q
from account.serializer import *
from asgiref.sync import sync_to_async
from login.serializer import UserSerializer
from channels.db import database_sync_to_async
from chat.models import Message , Conversation
from channels.generic.websocket import AsyncWebsocketConsumer

@database_sync_to_async
def get_user_with_profile(username):
    user = User.objects.get(username=username)
    profile = Profile.objects.get(user_id=user.id)
    user_ser = UserWithProfileSerializer(user).data
    user_ser['profile'] = ProfileSerializers(profile).data
    return user_ser

def get_messages_between_users(sender_id, receiver_id):
    messages = Message.objects.filter(
        (Q(sender_id=sender_id) & Q(receiver_id=receiver_id)) |
        (Q(sender_id=receiver_id) & Q(receiver_id=sender_id))
    ).order_by('created_at')
    
    return MessageSerializer(messages, many=True).data

class PrivateChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.partner_id = self.scope['url_route']['kwargs']['partner_id']
        self.user_id, self.partner_id = sorted([self.user_id, self.partner_id])
        self.room_name = f'chat_{self.user_id}_{self.partner_id}'
        self.room_group_name = self.room_name.replace(" ", "_")
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def send_message(self, event):#send message
        self.user = self.scope["user"]
        sender_ser = event.get('sender', None)
        receiver_ser = event.get('receiver', None)
        message = event.get('message', '')
        messages = event.get('messages', '')
        event_type = event.get('event', None)
        status = event.get('status', 500)
        if status == 205:
            await self.send(text_data=json.dumps({
                'response': {
                    'event': event_type,
                    'status': status,
                    'message': message,
                    'user': receiver_ser,
                    'receiver': receiver_ser,
                    'sender': sender_ser,
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

    async def receive(self, text_data=None, bytes_data=None):#receive message
        if text_data:
            text_data_json = json.loads(text_data)
            message_content = text_data_json.get('content')
            from_ = text_data_json.get('from')
            to_ = text_data_json.get('to')
            event = text_data_json.get('event')

            sender = await sync_to_async(User.objects.get)(username=from_)
            receiver = await sync_to_async(User.objects.get)(username=to_)

            sender_ser = await get_user_with_profile(from_)
            receiver_ser = await get_user_with_profile(to_)

            messages = await sync_to_async(get_messages_between_users)(sender_ser['id'], receiver_ser['id'])
            if event == "fetch_messages":
                await self.send(text_data=json.dumps({
                'response': {
                    'event': event,
                    'status': 206,
                    'messages': messages,
                    'user': receiver_ser,
                    'receiver': receiver_ser,
                    'sender': sender_ser,
                }
            }))
            elif event == "new_message":
                conversation = await self.get_or_create_conversation(sender, receiver)
                message = await sync_to_async(Message.objects.create)(
                    message=message_content,
                    sender=sender,
                    receiver=receiver,
                )
                await self.save_message(message)

                message_ser= await self.serialize_message(message)
                message_ser['sender'] = sender_ser
                message_ser['receiver'] = receiver_ser

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'send_message',
                        'message': message_ser,
                        'user' : receiver_ser,
                        'status' :205,
                        'event': event,
                        'receiver': receiver_ser,
                        'sender': sender_ser,
                    }
                )
        elif bytes_data:
            pass
            
