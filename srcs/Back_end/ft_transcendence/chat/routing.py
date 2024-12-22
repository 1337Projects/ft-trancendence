

from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('wss/chat/<str:user_id>/', consumers.PrivateChatConsumer.as_asgi()),
]