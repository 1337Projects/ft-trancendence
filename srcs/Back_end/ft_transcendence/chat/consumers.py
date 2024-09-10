# consumers.py

from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import Message
# from 

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
        # recipient = User.objects.get(id=recipient_id)
        # conversation = Conversation.objects.get(initiator=self.user, receiver=recipient)
        # Message.objects.create(conversation=conversation, sender=self.user, text=content)
        message = event['message']
        username = event["username"]
        # await self.send(text_data=json.dumps({
        #     'message': message ,
        #     "username":username ,
        #     'type': 'send_message',
        #     'status': 205,
        #     'id' : self.user_id,
        # }))
        await self.send(text_data=json.dumps({
        'response': {
            'event': 'new_message',
            'status': 205,
            'data': message,
            # 'from': from_,
            # 'to' : to
            # 'username': username,
            'id' : self.user_id,
            }
        }))
        print("send message:", message)


    async def receive(self, text_data):#receive message
        text_data_json = json.loads(text_data)
        message = text_data_json.get('content')
        # username = text_data_json.get('username')
        from_ = text_data_json.get('from')
        to = text_data_json.get('to')

        print("Received message:", text_data_json, from_, to)
        # await self.channel_layer.group_send(
        #     self.room_group_name,
        #     {
        #         'type': 'send_message',
        #         'message': message,
        #         "username" : username ,
        #         'status' :205,
        #     }
        # )
        await self.send(text_data=json.dumps({# user , messages  array status 206  fetch 
        'response': {
            'event': 'new_message',
            'status': 205,
            'content': message,
            'from': from_,
            # 'username': username,
            # 'id' : from_.id,
            # 'id' : to.id,
            'id' : self.user_id,
            }
        }))

        # response = {"response": {"status": 205, "data": message}}
        # self.send_message(response)
