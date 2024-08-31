from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
# from django.contrib.auth.hashers import make_password

class UserManager(BaseUserManager):
    def create_user(self, email, **extra_fields):
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.save(using=self._db)
        return  user

class User(AbstractBaseUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True, default='')
    first_name = models.CharField(default='', max_length=255)
    last_name = models.CharField(default='', max_length=255)
    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']


  