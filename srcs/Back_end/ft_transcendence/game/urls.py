from django.urls import path
from .views import user_game_stats, user_game_history

urlpatterns = [
    path('user_game_stats/<str:username>/', user_game_stats, name='user_game_stats'),
    path('user_game_history/<str:username>/', user_game_history, name='user_game_history'),
]
