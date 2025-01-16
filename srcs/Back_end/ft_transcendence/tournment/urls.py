from django.urls import  path
from .consumers.MatchMakingConsumer import MatchMakeingConsumer
from .consumers.TournamentConsumer import TournmentConsumer
from . import views


urlpatterns = [
    path('create/', views.TournmentViews.as_view({"post" : "create_tournment"})),
    path('get_all/', views.TournmentViews.as_view({"get" : "get_tournemts"})),
]

websocket_urlpatterns = [
    path('wss/tournment/<str:id>/',  TournmentConsumer.as_asgi()),
    path('wss/join/tournment/<str:id>/',  MatchMakeingConsumer.as_asgi()),
]