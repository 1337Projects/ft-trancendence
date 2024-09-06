# consumers.py

from channels.generic.websocket import AsyncWebsocketConsumer
import json

class PrivateChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Extract user IDs from URL route parameters
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.partner_id = self.scope['url_route']['kwargs']['partner_id']

        # Create a unique room name for the conversation
        self.room_name = f'chat_{self.user_id}_{self.partner_id}'
        self.room_group_name = self.room_name

        # Join the room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave the room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send the message to the room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    async def chat_message(self, event):
        message = event['message']

        # Send the message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))
