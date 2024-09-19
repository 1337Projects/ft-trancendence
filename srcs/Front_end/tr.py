# consumers.py

from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import Message , Conversation
from login.models import User
from login.serializer import UserSerializer
from .serializers import *
# from 

class PrivateChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.partner_id = self.scope['url_route']['kwargs']['partner_id']
        try:
            self.user = await User.objects.get(username=self.user_id)
            self.partner = await User.objects.get(username=self.partner_id)
        except User.DoesNotExist:
            # Handle the case where the user does not exist
            await self.close()
            return
        #check if the room is exist , then just enter or otherwise create it and then join it
        self.room_name = f'chat_{self.user_id}_{self.partner_id}'
        self.room_group_name = self.room_name.replace(" ", "_")
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()



    # async def get_conversation(self):
    #     user_id = self.user_id
    #     partner_id = self.partner_id
    #     try:
    #         return Conversation.objects.get(initiator=user_id, receiver=partner_id)
    #     except Conversation.DoesNotExist:
    #         return Conversation.objects.create(initiator=user_id, receiver=partner_id)

    async def get_conversation(self):
        user = await User.objects.get(username=self.user_id)
        partner = await User.objects.get(username=self.partner_id)
        try:
            return await Conversation.objects.get(initiator=user, receiver=partner)
        except Conversation.DoesNotExist:
            return await Conversation.objects.create(initiator=user, receiver=partner)
    
    async def receive(self, text_data):#receive message
        text_data_json = json.loads(text_data)
        message = text_data_json.get('content')
        event = text_data_json.get('event')
        from_user = text_data_json.get('from')
        to_user = text_data_json.get('to')

        conversation = await self.get_conversation()
        from_user = await User.objects.get(username=from_user)
        Message.objects.create(conversation=conversation, sender=from_user, text=message)

        print("Received message2:", text_data_json, from_user, to_user)
        if event == "new_message":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_message',
                    'message': message,
                }
            )

    async def send_message(self, event):#send message
        self.user = self.scope["user"]
        message = event['message']
        from_user = event['from_user']
        to_user = event['to_user']

        # message_instance = Message.objects.create(conversation=conversation, sender=self.user, text=message)
        # message_serialized = MessageSerializer(message_instance).data
        # sender_serialized = UserSerializer(self.user).data
        # receiver_serialized = UserSerializer(to_user).data

        await self.send(text_data=json.dumps({
        'response': {
            'status': 205,
            'event': 'new_message',
            'message': message_serialized,
            'from': sender_serialized,
            'to' : receiver_serialized,
            # 'id' : self.user_id,
            }
        }))
        print("send message1:", message)
        # serializer = UserSerializer()
        # message_obj_serializer = MessageSerializer()
        # response = {"response": {"user": serializer.data, "status": 205, "message" :message_obj_serializer.data}}



                # # Send initial conversation data (such as last messages) to the frontend
        # conversation = await self.get_conversation()
        # if conversation:
        #     messages = Message.objects.filter(conversation=conversation)
        #     messages_data = MessageSerializer(messages, many=True).data
        #     await self.send(text_data=json.dumps({
        #         'response': {
        #             'status': 200,
        #             'event': 'conversation_data',
        #             'messages': messages_data,
        #             'conversation_id': conversation.id,
        #         }
        #     }))