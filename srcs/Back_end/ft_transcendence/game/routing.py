from django.urls import re_path

# from game.consumers.match_making_cosumer import MatchmakingConsumer
from game.consumers.game_consumer import GameConsumer
from game.consumers.matchMakingConsumer import GameMatchMakingConsumer

websocket_urlpatterns = [
    re_path(r"^wss/game/join/$", GameMatchMakingConsumer.as_asgi()),
    re_path(r"^ws/game/(?P<game_id>\d+)/$", GameConsumer.as_asgi()),
]
    # re_path(r'^wss/match_making/$', MatchmakingConsumer.as_asgi()),
    # re_path(r'^ws/match_making/$', MatchmakingConsumer.as_asgi()),