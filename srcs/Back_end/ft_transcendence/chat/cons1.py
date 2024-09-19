
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import Message , Conversation
from login.models import User
from login.serializer import UserSerializer
from .serializers import *

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
        from_user_id = event['from_user']
        to_user = event['to_user']
        # created_at = event.get('created_at', '')
        # message_instance = Message.objects.create(conversation=conversation, sender=self.user, text=message)
        # message_serialized = MessageSerializer(message_instance).data
        # sender_serialized = UserSerializer(self.user).data
        # receiver_serialized = UserSerializer(to_user).data

        # Get the user object and serialize it
        from_user = await self.get_user(from_user_id)
        user_ser= UserSerializer(from_user).data

        # await self.send(text_data=json.dumps({
        # 'response': {
        #     'status': 205,
        #     'event': 'new_message',
        #     'message': message_serialized,
        #     'from': sender_serialized,
        #     'to' : receiver_serialized,
        #     # 'id' : self.user_id,
        #     }
        # }))

        await self.send(text_data=json.dumps({
        'response': {
            'event': 'new_message',
            'status': 205,
            'message': message,
            'user': user_ser,
            # 'to' : to_user
            # 'id' : self.user_id,
            }
        }))
        print("send message:", message)


    async def receive(self, text_data):#receive message
        text_data_json = json.loads(text_data)
        message = text_data_json.get('content')
        # username = text_data_json.get('username')
        from_ = text_data_json.get('from')
        to = text_data_json.get('to')
        event = text_data_json.get('event')

        # conversation = await self.get_conversation()
        # from_user = await User.objects.get(username=from_user)
        # Message.objects.create(conversation=conversation, sender=from_user, text=message)

        print("Received message:", text_data_json, from_, to)
        if event == "new_message":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_message',
                    'message': message,
                    "user" : from_ ,
                    'status' :205,
                }
            )
            # await self.send(text_data=json.dumps({# user , messages  array status 206  fetch 
            # 'response': {
            #     'event': 'new_message',
            #     'status': 205,
            #     'content': message,
            #     'from': from_,
            #     # 'username': username,
            #     # 'id' : from_.id,
            #     # 'id' : to.id,
            #     'id' : self.user_id,
            #     #created at , sender,image
            #     }
            # }))
        print("send message1:", message)
        response = {"response": {"status": 205, "data": message}}
        self.send_message(response)

    async def get_user(self, user_id):
        return await User.objects.aget(id=user_id)



#************************************************************#

# the name of the receiver is apear in this version 

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

    # async def send_message(self, event):#send message
    #     self.user = self.scope["user"]

    #     message = event['message']
    #     sender = event['user']
    #     # Ensure that 'user' is a dictionary with proper user info
    #     if isinstance(sender, dict):
    #         sender_ser = sender  # Use the dictionary directly
    #     else:
    #         # Fetch user data if not already provided
    #         user = await self.get_user(sender)
    #         sender_ser = UserSerializer(user).data
    #     sender_ser= UserSerializer(sender).data

    #     # sender = await self.get_user(event['user'])
    #     # sender_ser= UserSerializer(sender).data
    #     # if event == "new_message":
    #     # if event == "fetch_message":
    #     #     await self.send(text_data=json.dumps({
    #     #     'response': {
    #     #         'event': event,
    #     #         'status': 206,
    #     #         'messages': message,
    #     #         'user': sender_ser,
    #     #         }
    #     #     }))
    #     # elif event == "new_message":
    #     #     await self.send(text_data=json.dumps({
    #     #     'response': {
    #     #         'event': event,
    #     #         'status': 205,
    #     #         'message': message,
    #     #         'user': sender_ser,
    #     #         'receiver': receiver_ser,
    #     #         'sender': sender_ser,
    #     #         }
    #     await self.send(text_data=json.dumps({
    #     'response': {
    #         # 'event': event,
    #         # 'status': 205,
    #         # 'message': message,
    #         # 'user': sender_ser,
    #         # 'receiver': receiver_ser,
    #         'sender': sender_ser,
    #         }
    #     }))
    #     print("send message:", message)


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
        # if event == "fetch_message":
        #     await self.channel_layer.group_send(
        #         self.room_group_name,
        #         {
        #             'type': 'send_message',
        #             'messages': [],
        #             "user" : receiver_ser,
        #             'status' :206,
        #             'event': event,
        #         }
        #     )
        # elif event == "new_message":
        #     await self.channel_layer.group_send(
        #         self.room_group_name,
        #         {
        #             'type': 'send_message',
        #             'message': message,
        #             'content': message,
        #             "user" : sender_ser,
        #             'status' :205,
        #             'event': event,
        #         }
        #     )

        if event == "fetch_messages":
            await self.send(text_data=json.dumps({
            'response': {
                'event': event,
                'status': 206,
                'messages': [],
                'user': receiver_ser,
                'receiver': receiver_ser,
                'sender': sender_ser,
                }
            }))
        elif event == "new_message":
            await self.send(text_data=json.dumps({
            'response': {
                'event': event,
                'status': 205,
                'message': message,
                'user': sender_ser,
                'receiver': receiver_ser,
                'sender': sender_ser,
                }
            }))
        print("send message1:", message)

    # async def get_user(self, user_id):
    #     return await User.objects.aget(id=user_id)
