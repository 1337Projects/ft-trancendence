from django.urls import re_path

from .consumers.match_making_cosumer import MatchmakingConsumer

websocket_urlpatterns = [
    re_path(r'^ws/match_making/$', MatchmakingConsumer.as_asgi()),
]