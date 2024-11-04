from django.urls import  path
from . import consumers
from . import views

urlpatterns = [
    path('create/', views.TournmentViews.as_view({"post" : "create_tournment"}))
]

websocket_urlpatterns = [
    path('ws/tournment/<str:id>/',  consumers.TournmentConsumer.as_asgi()),
]