from django.urls import re_path, path

# from game.consumers.match_making_cosumer import MatchmakingConsumer
from game.consumers.game_consumer import GameConsumer
from game.consumers.matchMakingConsumer import GameMatchMakingConsumer, TicTakTeoMatchMaking
from game.consumers.tictac_consumer import TicTacConsumer
from game.consumers.tictac_ai_consumer import TicTacWithAiConsumer

websocket_urlpatterns = [
    path("wss/game/tic-tac-teo/play/ai/", TicTacWithAiConsumer.as_asgi()),
    path("wss/game/ping-pong/join/<str:type>/<str:room_id>/", GameMatchMakingConsumer.as_asgi()),
    path("wss/game/tic-tac-toe/join/<str:type>/<str:room_id>/", TicTakTeoMatchMaking.as_asgi()),
    path("wss/game/tic-tac-teo/play/<str:game_id>/", TicTacConsumer.as_asgi()),
    re_path(r"^wss/game/(?P<game_id>\d+)/$", GameConsumer.as_asgi()),
]
    # re_path(r'^wss/match_making/$', MatchmakingConsumer.as_asgi()),
    # re_path(r'^ws/match_making/$', MatchmakingConsumer.as_asgi()),