from django.db import models
from login.models import User

class Match(models.Model):
    player_1 = models.ForeignKey(User, related_name="player1", on_delete=models.CASCADE)
    player_2 = models.ForeignKey(User, related_name="player2", on_delete=models.CASCADE)
    player_score_1 = models.PositiveIntegerField(default=0)
    player_score_2 = models.PositiveIntegerField(default=0)
    winner = models.ForeignKey(User, related_name="winner", on_delete=models.CASCADE, null=True, blank=True)
