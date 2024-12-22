from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('wss/notifications/<str:username>/', consumers.NotificationConsumer.as_asgi()),
]
