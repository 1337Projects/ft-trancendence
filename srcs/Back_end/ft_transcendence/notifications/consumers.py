
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async #, database_sync_to_async
from .models import GameRequest
from django.contrib.auth import get_user_model



User = get_user_model()

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
        # Remove the user from their group
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

        if event == "send_request":
            sender_username = data["sender"]
            receiver_username = data["receiver"]
            message = data.get("message", "You have a new game request!")
            
            # Create the game request in the database
            game_request = await self.create_game_request(sender_username, receiver_username, message)

            # Send the notification to the receiver in real-time
            await self.channel_layer.group_send(
                f"user_{receiver_username}",
                {
                    "type": "send_notification",
                    "notification": {
                        "sender": game_request.sender.username,
                        "message": game_request.message,
                        "created_at": str(game_request.created_at),
                        "is_accepted": game_request.is_accepted,
                    },
                }
            )

    async def send_notification(self, event):
        # Send the notification message to WebSocket
        await self.send(text_data=json.dumps(event["notification"]))

    @sync_to_async
    def create_game_request(self, sender_username, receiver_username, message):
        sender = User.objects.get(username=sender_username)
        receiver = User.objects.get(username=receiver_username)
        return GameRequest.objects.create(sender=sender, receiver=receiver, message=message)

    @sync_to_async
    def get_unread_requests(self):
        return GameRequest.objects.filter(receiver__username=self.username, is_read=False)
    async def get_user_notifications(self, username):
    # Filter by the receiver's username
        return await sync_to_async(lambda: list(GameRequest.objects.filter(receiver__username=username).values()))()

    # async def get_user_notifications(self, user):
    #     # Query for notifications related to the user
    #     notifications = await sync_to_async(GameRequest.objects.filter)(
    #         receiver=user
    #     )
        
    #     # Prepare the notifications to send
    #     notifications_list = []
    #     for notification in notifications:
    #         notifications_list.append({
    #             "id": notification.id,
    #             "sender": notification.sender.username,
    #             "message": notification.message,
    #             "is_accepted": notification.is_accepted,
    #             "created_at": notification.created_at.isoformat(),
    #             "is_read": notification.is_read,
    #         })
        
    #     return notifications_list


# import json
# from channels.generic.websocket import AsyncWebsocketConsumer

# class NotificationConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.username = self.scope['url_route']['kwargs']['username']

#         self.group_name = f"user_{self.username}"
        
#         await self.channel_layer.group_add(self.group_name, self.channel_name)
#         await self.accept()

#     async def disconnect(self, close_code):
#         await self.channel_layer.group_discard(self.group_name, self.channel_name)

#     async def receive(self, text_data):
#         data = json.loads(text_data)
#         event = data.get("event")

#         if event == "fetch nots":
#             # Fetch user notifications here
#             notifications = await self.get_user_notifications(self.username)
#             await self.send(text_data=json.dumps({
#                 "event": "fetch_nots",
#                 "notifications": notifications,
#             }))
        

#     async def get_user_notifications(self, username):
#         # Fetch notifications for the user from the database
#         notifications = [
#             {"message": "Game request from user1", "timestamp": "2024-11-02 10:30:00"},
#             {"message": "Game request from user2", "timestamp": "2024-11-02 11:00:00"},
#         ]
#         return notifications

#     async def send_notification(self, event):
#         await self.send(text_data=json.dumps(event["notification"]))

# # import json
# # from channels.generic.websocket import AsyncWebsocketConsumer

# # class NotificationConsumer(AsyncWebsocketConsumer):
# #     async def connect(self):
# #         print(self.scope['user'], "++++")
# #         self.user = self.scope['user']
# #         if self.user.is_authenticated:
# #             self.group_name = f"user_{self.user.id}"
# #             await self.channel_layer.group_add(self.group_name, self.channel_name)
# #             await self.accept()
# #         else:
# #             await self.close()

# #     async def disconnect(self, close_code):
# #         if self.user.is_authenticated:
# #             await self.channel_layer.group_discard(self.group_name, self.channel_name)

# #     async def receive(self, text_data):
# #         pass

# #     async def send_notification(self, event):
# #         await self.send(text_data=json.dumps(event["notification"]))
