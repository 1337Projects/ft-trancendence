from django.urls import path
from .views import index, match_makign, game

urlpatterns = [
    path('', index, name='index'),
    path('match/', match_makign, name='match'),
    path('<int:game_id>/', game, name='game'),
]
