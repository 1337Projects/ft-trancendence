

from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/chat/<str:user_id>/', consumers.PrivateChatConsumer.as_asgi()),
]