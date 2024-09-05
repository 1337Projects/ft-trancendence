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
    avatar = models.CharField(default='')
    image = models.CharField(default='')
    online = models.BooleanField(default=False)
    objects = ProfileManager()

class Friends(AbstractBaseUser):
    status = models.CharField(default='')
    sender = models.IntegerField(default=0)
    receiver = models.IntegerField(default=0)

# @receiver(user_logged_in)
# def user_logged_in(sender, user, request, **kwargs):
#     profile = Profile.objects.get(user=user)
#     profile.online = True
#     profile.save()

# @receiver(user_logged_out)
# def user_logged_out(sender, user, request, **kwargs):
#     profile = Profile.objects.get(user=user)
#     profile.online = False
#     profile.save()