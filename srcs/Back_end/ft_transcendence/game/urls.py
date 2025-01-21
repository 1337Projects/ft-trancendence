from django.urls import path
from .views import user_game_stats

urlpatterns = [
    path('user_game_stats/', user_game_stats, name='user_game_stats')
]
