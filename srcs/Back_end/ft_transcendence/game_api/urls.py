from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("wss/game/play/<str:id>/", consumers.GameConsumer.as_asgi()),
    path("wss/game/join/game/", consumers.GameMatchMakingConsumer.as_asgi()),
]