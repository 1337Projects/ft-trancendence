from django.db import models
from login.models import User
from django.utils import timezone


class Game1(models.Model):
    player1 = models.ForeignKey(User, related_name='games1_as_player1', on_delete=models.CASCADE)
    player2 = models.ForeignKey(User, related_name='games1_as_player2', on_delete=models.CASCADE)
    winner = models.ForeignKey(User, related_name='game_1_winner', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    ended = models.BooleanField(default=False)

class Game(models.Model):
    player1 = models.ForeignKey(User, related_name='games_as_player1', on_delete=models.CASCADE)
    player2 = models.ForeignKey(User, related_name='games_as_player2', on_delete=models.CASCADE)
    score1 = models.IntegerField(default=0)
    score2 = models.IntegerField(default=0)
    winner = models.ForeignKey(User, related_name='winner', on_delete=models.CASCADE, null=True, blank=True)
    loser = models.ForeignKey(User, related_name='loser', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
