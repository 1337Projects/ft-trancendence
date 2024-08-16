from django.db import models

# Create your models here.

class User(models.Model):
    username = models.CharField(max_length=255)
    email = models.CharField(max_length=255, blank=True)
    first_name = models.CharField(max_length=255, default='')
    last_name = models.CharField(max_length=255, default='')
    google_id = models.BigIntegerField()

    class Meta:
        verbose_name = "User"