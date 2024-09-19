
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import Message , Conversation
from login.models import User
from login.serializer import UserSerializer
from .serializers import *
from asgiref.sync import sync_to_async

class PrivateChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.partner_id = self.scope['url_route']['kwargs']['partner_id']
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
        event_type = event.get('event', None)
        status = event.get('status', 500)

        if status == 206:
            await self.send(text_data=json.dumps({
                'response': {
                    'event': event_type,
                    'status': event.get('status', 500),
                    'messages': [],
                    # 'messages': message,
                    'user': receiver_ser,
                    'receiver': receiver_ser,
                    'sender': sender_ser,
                }
            }))
        elif status == 205:
            await self.send(text_data=json.dumps({
                'response': {
                    'event': event_type,
                    'status': event.get('status', 500),
                    'message': message,
                    'user': receiver_ser,
                    'receiver': receiver_ser,
                    'sender': sender_ser,
                }
            }))
        print("send message:", message)


    async def receive(self, text_data):#receive message
        text_data_json = json.loads(text_data)
        message = text_data_json.get('content')
        from_ = text_data_json.get('from')
        to_ = text_data_json.get('to')
        event = text_data_json.get('event')
        sender = await sync_to_async(User.objects.get)(username=from_)
        sender_ser= UserSerializer(sender).data
        receiver = await sync_to_async(User.objects.get)(username=to_)
        receiver_ser= UserSerializer(receiver).data

        print("Received message:", text_data_json)
        if event == "fetch_messages":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_message',
                    'messages': [],
                    'user' : receiver_ser,
                    'status' :206,
                    'event': event,
                    'receiver': receiver_ser,
                    'sender': sender_ser,
                }
            )
        elif event == "new_message":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_message',
                    'message': message,
                    'content': message,
                    # 'user' : sender_ser,
                    'status' :205,
                    'event': event,
                    'receiver': receiver_ser,
                    'sender': sender_ser,
                }
            )
        print("send message1:", message)

    # async def get_user(self, user_id):
    #     return await User.objects.aget(id=user_id)
