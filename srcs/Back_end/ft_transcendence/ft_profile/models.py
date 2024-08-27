from django.db import models
from login.models import User
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class ProfileManager(BaseUserManager):
    def create(self, **extra_fields):
        user = self.model(**extra_fields)
        user.save(using=self._db)
        password = None
        return  user

class Profile(AbstractBaseUser):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(default='', blank=True)
    exp = models.IntegerField(default=0)
    avatar = models.CharField(default='')
    image = models.CharField(default='')
    online = models.BooleanField(default=False)
    objects = ProfileManager()