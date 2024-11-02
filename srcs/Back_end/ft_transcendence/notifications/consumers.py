import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("Attempting to connect...")
        self.username = self.scope['url_route']['kwargs']['username']
        print(f"Username from URL: {self.username}")

        self.group_name = f"user_{self.username}"
        
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        event = data.get("event")

        if event == "fetch nots":
            # Fetch user notifications here
            notifications = await self.get_user_notifications(self.username)
            await self.send(text_data=json.dumps({
                "event": "fetch_nots",
                "notifications": notifications,
            }))

    async def get_user_notifications(self, username):
        # Fetch notifications for the user from the database
        notifications = [
            {"message": "Game request from user1", "timestamp": "2024-11-02 10:30:00"},
            {"message": "Game request from user2", "timestamp": "2024-11-02 11:00:00"},
        ]
        return notifications

    async def send_notification(self, event):
        await self.send(text_data=json.dumps(event["notification"]))

# import json
# from channels.generic.websocket import AsyncWebsocketConsumer

# class NotificationConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         print(self.scope['user'], "++++")
#         self.user = self.scope['user']
#         if self.user.is_authenticated:
#             self.group_name = f"user_{self.user.id}"
#             await self.channel_layer.group_add(self.group_name, self.channel_name)
#             await self.accept()
#         else:
#             await self.close()

#     async def disconnect(self, close_code):
#         if self.user.is_authenticated:
#             await self.channel_layer.group_discard(self.group_name, self.channel_name)

#     async def receive(self, text_data):
#         pass

#     async def send_notification(self, event):
#         await self.send(text_data=json.dumps(event["notification"]))
