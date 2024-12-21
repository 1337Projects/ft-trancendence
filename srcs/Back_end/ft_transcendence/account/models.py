from django.db import models
from login.models import User
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver
from django.contrib.auth import get_user_model

User = get_user_model()

class ProfileManager(BaseUserManager):
    def create_profile(self, **extra_fields):
        profile = self.model(**extra_fields)
        profile.save(using=self._db)
        return  profile
        
class Profile(AbstractBaseUser):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    bio = models.TextField(default='', blank=True)
    level = models.FloatField(default=0.0)
    banner = models.CharField(default='http://localhost:8000/media/default-banner.webp')
    avatar = models.CharField(default='http://localhost:8000/media/default-avatar.jpeg')
    last_activity = models.DateTimeField(auto_now=True)
    objects = ProfileManager()

class Friends(AbstractBaseUser):
    status = models.CharField(default='')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='send_requests')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_requests')
