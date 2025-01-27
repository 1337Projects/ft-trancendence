from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import GameRequest
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from account.serializer import *
from .serializers import GameRequestSerializer
from django.core.cache import cache
from account.models import Profile
from django.contrib.auth.models import AnonymousUser
import json


User = get_user_model()
@database_sync_to_async
def get_user_with_profile(username):
    user = User.objects.get(username=username)
    profile = Profile.objects.get(user_id=user.id)
    user_ser = UserWithProfileSerializer(user).data
    user_ser['profile'] = ProfileSerializers(profile).data
    return user_ser




class NotificationConsumer(AsyncWebsocketConsumer):
    async def senderror(self, error):
        res = {
            "status" : 400,
            "error" : error
        }
        await self.send(text_data=json.dumps({"response" : res}))
    
    async def connect(self):
        if isinstance(self.scope['user'], AnonymousUser):
            await self.close()
            return
        self.username = self.scope['url_route']['kwargs']['username']
        self.user = self.scope['user']
        user_channels = cache.get(f"channels_{self.username}", [])
        if self.channel_name not in user_channels:
            user_channels.append(self.channel_name)
        cache.set(f"channels_{self.username}", user_channels, timeout=None)
        try:
            await self.change_online_state(value=True)
            
        except Exception as e:
            await self.close()
        await self.accept()
    
    async def disconnect(self, close_code):
        user_channels = cache.get(f"channels_{self.username}", [])
        if self.channel_name in user_channels:
            user_channels.remove(self.channel_name)
            await self.change_online_state(value=False)
        cache.set(f"channels_{self.username}", user_channels, timeout=None)

    @database_sync_to_async     
    def change_online_state(self, value):
        try:
            user = User.objects.get(username=self.user)
            profile = Profile.objects.get(user_id=user.id)
            profile.online = value
            profile.save()
        except Exception as e:
            self.senderror(str(e))

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            event = data.get("event")
        except Exception as a:
            await self.senderror(str(a))
        if event == "fetch nots":
            try:
                usernamo = data["sender"]
                page = data.get("page", 1)
                page_size = data.get("page_size")
                user = await sync_to_async(User.objects.get)(username=usernamo)
                notifications = await self.get_user_notifications(user, page, page_size)
                await self.send(text_data=json.dumps({
                    "response": {
                        "nots": notifications["notifications"],
                        "num_of_notify": notifications["num_of_notify"],
                        "status": 208 if data.get("page") == None else 209,
                    }
                }))
            except Exception as e:
                await self.senderror(str(e))

        elif event == "send_request":
            try:
                sender_username = data["sender"]
                receiver_username = data["receiver"]
                message = data.get("message")
                link = data.get("link")
                
                receiverr = await get_user_with_profile(receiver_username)
                game_request = await self.create_game_request(sender_username, receiver_username, message, link)
                sender_channel_names = self.get_user_channel_names(sender_username)
            except Exception as e:
                await self.senderror(str(e))
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
            self.senderror(str(e))
    def get_user_channel_names(self, username):
        return cache.get(f"channels_{username}", [])
