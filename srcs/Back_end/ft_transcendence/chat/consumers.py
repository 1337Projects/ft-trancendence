
import json
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
from .serializers import ConversationListSerializer, ConversationSerializer
from login.views import check_if_blocked


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
    ).order_by('-created_at'))# - ou nn ?? who knows ? # from the last one to the first one
    # print(sender_id, receiver_id, "*******\n" ,messages)
    return messages

class PrivateChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        # self.partner_id = self.scope['url_route']['kwargs']['partner_id']
        # self.user_id, self.partner_id = sorted([self.user_id, self.partner_id])
        # self.room_name = f'chat_{self.user_id}_{self.partner_id}'
        # self.room_group_name = self.room_name.replace(" ", "_")
        # await self.channel_layer.group_add(
        #     self.room_group_name,
        #     self.channel_name
        # )
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
    
    async def receive(self, text_data=None, bytes_data=None):#receive message
        if text_data:
            text_data_json = json.loads(text_data)
            event = text_data_json.get('event')
            if event == "fetch_conversations":
                await self.fetch_conversations()
            else:
                message_content = text_data_json.get('content')
                from_ = text_data_json.get('from')
                to_ = text_data_json.get('to')
                try:
                    sender = await sync_to_async(User.objects.get)(username=from_)
                    receiver = await sync_to_async(User.objects.get)(username=to_)
                except User.DoesNotExist:
                    await self.send(text_data=json.dumps({
                        'error': f"user not found: {str(e)}"
                    }))
                    # await self.close()
                    return
                sender_ser = await get_user_with_profile(from_)
                receiver_ser = await get_user_with_profile(to_)
                # i should check if the the relation between us is blocked or not
                # if await check_if_blocked(sender_ser['id'], receiver_ser['id']):
                #     await self.send(text_data=json.dumps({
                #         'error': "blocked relationship"
                #     }))
                #     return


                #comment this to try pagination and uncomment the comment part below
                # messages = await sync_to_async(get_messages_between_users)(sender_ser['id'], receiver_ser['id'])

                #get all the messages now as a queryset if you want the old code back uncomment get_messages_between_users
                all_messages = await get_messages_between_users(sender_ser['id'], receiver_ser['id'])
                #handle the pagination
                page = text_data_json.get('page', 1)
                limit = text_data_json.get('limit', 10)
                paginator = Paginator(all_messages, limit)
                try:
                    messages = paginator.page(page)
                    # print("here ***", messages)
                except EmptyPage:
                    messages = []
                messages = [await self.serialize_message(message) for message in messages]
                # print("here2 ***", messages)
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
                        conversation=conversation
                    )
                    conversation.content_of_last_message = message.message
                    conversation.last_message_time = message.created_at
                    await sync_to_async(conversation.save)()
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
                # if event not in ["fetch_messages", "new_message", "fetch_conversations"]:
                #     await self.send(text_data=json.dumps({
                #         'error': f"Unexpected event: {event}"
                #     }))
        elif bytes_data:
            pass
