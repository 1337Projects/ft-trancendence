from django.db import models
from login.models import User
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class ProfileManager(BaseUserManager):
    def create_profile(self, **extra_fields):
        profile = self.model(**extra_fields)
        profile.save(using=self._db)
        return  profile

class Profile(AbstractBaseUser):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    bio = models.TextField(default='', blank=True)
    exp = models.IntegerField(default=0)
    avatar = models.CharField(default='')
    image = models.CharField(default='')
    online = models.BooleanField(default=False)
    objects = ProfileManager()