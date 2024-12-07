from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("ws/game/play/<str:id>/", consumers.GameConsumer.as_asgi()),
    path("ws/game/join/game/", consumers.GameMatchMakingConsumer.as_asgi()),
]