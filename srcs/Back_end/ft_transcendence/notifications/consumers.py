
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async #, database_sync_to_async
from .models import GameRequest
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from account.serializer import *
from login.serializer import UserSerializer
from .serializers import GameRequestSerializer

User = get_user_model()
import sys
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
        self.group_name = f"user_{self.username}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        # unread_requests = await self.get_unread_requests()
        # for request in unread_requests:
        #     await self.send(text_data=json.dumps({
        #         "sender": request.sender.username,
        #         "message": request.message,
        #         "created_at": str(request.created_at),
        #         "is_accepted": request.is_accepted
        #     }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        event = data.get("event")

        if event == "fetch nots":
            user = await sync_to_async(User.objects.get)(username=self.username)
            notifications = await self.get_user_notifications(user)
            await self.channel_layer.group_send(
                f"user_{user.username}",
                {
                    "type": "send_notification",
                    "data" : {
                            "response" : {
                                "nots": notifications,
                                "status" : 208
                            }
                        }
                    }
            )

        elif event == "send_request":
            sender_username = data["sender"]
            receiver_username = data["receiver"]
            message = data.get("message")
            
            receiverr = await get_user_with_profile(receiver_username)
            game_request = await self.create_game_request(sender_username, receiver_username, message)
            await self.channel_layer.group_send(
                f"user_{sender_username}",
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
        # print(serializer.data)
        # sys.stdout.flush()
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
