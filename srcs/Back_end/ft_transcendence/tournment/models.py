from django.db import models
from login.models import User


class Tournment(models.Model):

    TOURNMENT_STATUS_CHOICES = [
        ('waiting',  "WAITING"),
        ('ongoing',  "ONGOING"),
        ('ended', "ENDED"),
    ]

    max_players = models.IntegerField()
    players = models.ManyToManyField(User, related_name='players')
    tournament_name = models.CharField(max_length=200, blank=True)
    tourament_status = models.CharField(max_length=10, choices=TOURNMENT_STATUS_CHOICES, default='waiting')
    created_at = models.DateTimeField(auto_now=True)
