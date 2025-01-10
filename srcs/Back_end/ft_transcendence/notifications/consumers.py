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
        user_channels = cache.get(f"channels_{self.username}", [])
        if self.channel_name not in user_channels:
            user_channels.append(self.channel_name)
        cache.set(f"channels_{self.username}", user_channels, timeout=None)
        await self.accept()

    async def disconnect(self, close_code):
        user_channels = cache.get(f"channels_{self.username}", [])
    
        if self.channel_name in user_channels:
            user_channels.remove(self.channel_name)
        cache.set(f"channels_{self.username}", user_channels, timeout=None)

    async def receive(self, text_data):
        data = json.loads(text_data)
        event = data.get("event")
        if event == "fetch nots":
            try:
                print('---------------------------------------------------', data)
                sys.stdout.flush()
                usernamo = data["sender"]
                page = data.get("page", 1)
                page_size = data.get("page_size")
                user = await sync_to_async(User.objects.get)(username=usernamo)
                notifications = await self.get_user_notifications(user, page, page_size)
                await self.send(text_data=json.dumps({
                    "response": {
                        "nots": notifications["notifications"],
                        "num_of_notify": notifications["num_of_notify"],
                        # "current_page": notifications["current_page"],
                        "status": 208 if data.get("page") == None else 209,
                    }
                }))
            except Exception as e:
                # print(e)
                # print('---------------------------------------------------errora')
                # sys.stdout.flush()
                return

        elif event == "send_request":
            sender_username = data["sender"]
            receiver_username = data["receiver"]
            message = data.get("message")
            link = data.get("link")
            
            receiverr = await get_user_with_profile(receiver_username)
            game_request = await self.create_game_request(sender_username, receiver_username, message, link)
            sender_channel_names = self.get_user_channel_names(sender_username)
            # print('---------------------------------------------------', sender_channel_names)
            # sys.stdout.flush()
            if sender_channel_names:
                for channel_name in sender_channel_names:
                    await self.channel_layer.send(
                        channel_name,
                        {
                            "type": "send_notification",
                            "data" : {
                                    "response" : {
                                        "not": {
                                            "sender": receiverr,
                                            "message": game_request.message,
                                            "created_at": str(game_request.created_at),
                                            "is_accepted": game_request.is_accepted,
                                            "link": link,
                                        },
                                        "status" : 207
                                    }
                                }
                        }
                    )

    async def send_notification(self, event):
        await self.send(text_data=json.dumps(event["data"]))

    @sync_to_async
    def create_game_request(self, sender_username, receiver_username, message, link):
        sender = User.objects.get(username=sender_username)
        receiver = User.objects.get(username=receiver_username)
        return GameRequest.objects.create(sender=sender, receiver=receiver, message=message, link=link)

    @sync_to_async
    def get_unread_requests(self):
        return GameRequest.objects.filter(receiver__username=self.username, is_read=False)

    @sync_to_async
    def get_user_notifications(self, user, page=1, page_size=7):
        try:
            offset = (page - 1) * page_size
            notifications = GameRequest.objects.filter(sender=user)[offset : offset + page_size]

            num_of_notify = GameRequest.objects.filter(sender=user, created_at__gt=user.last_notification_seen)[offset : offset + page_size].count()
            
            notifications_list = []
            serializer = GameRequestSerializer(notifications, many=True)
            # print('-------------------------------------------321--------', notifications_list)
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
                    "link": notification['link'],
                })

            return {
                "notifications": notifications_list,
                "num_of_notify": num_of_notify,
            }
        except Exception as e:
            print("errora", e)
            sys.stdout.flush()
    def get_user_channel_names(self, username):
        return cache.get(f"channels_{username}", [])
