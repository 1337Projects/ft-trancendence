from django.urls import  path
from . import consumers

websocket_urlpatterns = [
    path('ws/tournment/<str:id>/',  consumers.TournmentConsumer.as_asgi()),
]