from django.db import models

# Create your models here.

class User(models.Model):
    username = models.CharField(max_length=10)
    firstname = models.CharField(max_length=10)
    lastname = models.CharField(max_length=10)
    phonenumber = models.PositiveIntegerField()

    class Meta:
        verbose_name = "User"