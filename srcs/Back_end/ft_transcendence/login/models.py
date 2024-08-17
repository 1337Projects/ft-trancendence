from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    email = models.EmailField(unique=True)
    password = models.CharField(default='', max_length=128)
    username = models.CharField(max_length=150, unique=True, default='')
    first_name = models.CharField(default='', max_length=255)
    last_name = models.CharField(default='', max_length=255)
    google_id = models.CharField(default=0)
    objects = UserManager()
