
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async #, database_sync_to_async
from .models import GameRequest
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from account.serializer import *
from login.serializer import UserSerializer
from .serializers import GameRequestSerializer
from channels.layers import get_channel_layer
from django.core.cache import cache
import sys
from django.core.paginator import Paginator

User = get_user_model()
@database_sync_to_async
def get_user_with_profile(username):
    user = User.objects.get(username=username)
    profile = Profile.objects.get(user_id=user.id)
    user_ser = UserWithProfileSerializer(user).data
    user_ser['profile'] = ProfileSerializers(profile).data
    return user_ser


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.username = self.scope['url_route']['kwargs']['username']
        cache.set(f"channel_{self.username}", self.channel_name, timeout=None)
        await self.accept()

    async def disconnect(self, close_code):
        cache.delete(f"channel_{self.username}")

    async def receive(self, text_data):
        data = json.loads(text_data)
        event = data.get("event")

        if event == "fetch nots":
            try:
                usernamo = data["sender"]
                user = await sync_to_async(User.objects.get)(username=usernamo)
                notifications = await self.get_user_notifications(user)
                # print(notifications)
                # sys.stdout.flush()
                await self.send(text_data=json.dumps({
                    "response" : {
                        "nots": notifications,
                        "status" : 208,
                    }
                }))
            except Exception as e:
                return

        elif event == "send_request":
            sender_username = data["sender"]
            receiver_username = data["receiver"]
            message = data.get("message")
            
            receiverr = await get_user_with_profile(receiver_username)
            game_request = await self.create_game_request(sender_username, receiver_username, message)
            sender_channel_name = self.get_user_channel_name(sender_username)
            if sender_channel_name:
                await self.channel_layer.send(
                    sender_channel_name,
                    {
                        "type": "send_notification",
                        "data" : {
                                "response" : {
                                    "not": {
                                        "sender": receiverr,
                                        "message": game_request.message,
                                        "created_at": str(game_request.created_at),
                                        "is_accepted": game_request.is_accepted,
                                    },
                                    "status" : 207
                                }
                            }
                    }
                )

    async def send_notification(self, event):
        await self.send(text_data=json.dumps(event["data"]))

    @sync_to_async
    def create_game_request(self, sender_username, receiver_username, message):
        sender = User.objects.get(username=sender_username)
        receiver = User.objects.get(username=receiver_username)
        return GameRequest.objects.create(sender=sender, receiver=receiver, message=message)

    @sync_to_async
    def get_unread_requests(self):
        return GameRequest.objects.filter(receiver__username=self.username, is_read=False)

    @sync_to_async
    def get_user_notifications(self, user):
        notifications = GameRequest.objects.filter(sender=user)
        serializer = GameRequestSerializer(notifications,  many=True)
        notifications_list = []

        for notification in serializer.data:

            user = User.objects.get(username=notification["receiver_username"])
            profile = Profile.objects.get(user_id=notification["receiver"])
            user_ser = UserWithProfileSerializer(user).data
            user_ser['profile'] = ProfileSerializers(profile).data
            notifications_list.append({
                "id": notification["id"],
                "sender": user_ser,
                "message": notification["message"],
                "is_accepted": notification['is_accepted'],
                "created_at": notification['created_at'],
                "is_read": notification['is_read'],
            })
        return notifications_list
    def get_user_channel_name(self, username):
        return cache.get(f"channel_{username}")
