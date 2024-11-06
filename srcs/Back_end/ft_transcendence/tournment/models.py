from django.db import models
from login.models import User

# Create your models here.

class Player(models.Model):
    user_id = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255, blank=True)
    avatar = models.CharField(max_length=200, blank=True, default='http://localhost:8000/media/default-banner.jpg')


class Tournment(models.Model):

    TOURNMENT_MODE_CHOICES = [
        ('local', "Local"),
        ('remote',  "Remote"),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    max_players = models.IntegerField()
    mode =  models.CharField(max_length=10, choices=TOURNMENT_MODE_CHOICES)
    players = models.ManyToManyField(Player, related_name='players')

    
    
