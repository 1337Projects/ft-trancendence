from django.db import models
from login.models import User
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.dispatch import receiver
from django.contrib.auth import get_user_model


class ProfileManager(BaseUserManager):
    def create_profile(self, **extra_fields):
        profile = self.model(**extra_fields)
        profile.save(using=self._db)
        return  profile
        
class Profile(models.Model): 
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    bio = models.TextField(default='', blank=True)
    level = models.FloatField(default=0.0)
    banner = models.CharField(default='')
    avatar = models.CharField(default='')
    online = models.BooleanField(default=False)
    objects = ProfileManager()

class Friends(models.Model):
    status = models.CharField(default='')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='send_requests')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_requests')
    blocker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='the_blocker', null=True, blank=True)

class ExperienceLog(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='experience_logs')
    experience_gained = models.IntegerField(default=0)
    date_logged = models.DateTimeField(auto_now_add=True)