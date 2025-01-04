from django.urls import re_path, path

# from game.consumers.match_making_cosumer import MatchmakingConsumer
from game.consumers.game_consumer import GameConsumer
from game.consumers.matchMakingConsumer import GameMatchMakingConsumer

websocket_urlpatterns = [
    path("wss/game/join/<str:type>/<str:room_id>/", GameMatchMakingConsumer.as_asgi()),
    re_path(r"^wss/game/(?P<game_id>\d+)/$", GameConsumer.as_asgi()),
]
    # re_path(r'^wss/match_making/$', MatchmakingConsumer.as_asgi()),
    # re_path(r'^ws/match_making/$', MatchmakingConsumer.as_asgi()),