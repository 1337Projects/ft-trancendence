from django.db import models

# Create your models here.

class Tournment(models.Model):
    max_players = models.IntegerField()
    mode =  models.CharField(max_length=10)
    
    
