from django.db import models
from login.models import User

# Create your models here.




class Tournment(models.Model):

    TOURNMENT_MODE_CHOICES = [
        ('local', "Local"),
        ('remote',  "Remote"),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    max_players = models.IntegerField()
    mode =  models.CharField(max_length=10, choices=TOURNMENT_MODE_CHOICES)
    players = models.ManyToManyField(User, related_name='players')

    
    
