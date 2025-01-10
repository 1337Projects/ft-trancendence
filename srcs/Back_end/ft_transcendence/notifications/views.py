from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import GameRequest
from .serializers import GameRequestSerializer

# @receiver(post_save, sender=GameRequest)
# def notify_user(sender, instance, created, **kwargs):
#     if created:
#         channel_layer = get_channel_layer()
#         notification_data = GameRequestSerializer(instance).data
#         async_to_sync(channel_layer.group_send)(
#             f"user_{instance.receiver.id}", 
#             {
#                 "type": "send_notification",
#                 "notification": notification_data
#             }
#         )

# from rest_framework import generics, permissions
# from .models import GameRequest
# from .serializers import GameRequestSerializer

# class UserGameRequestsView(generics.ListAPIView):
#     serializer_class = GameRequestSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         user = self.request.user
#         return GameRequest.objects.filter(receiver=user)
