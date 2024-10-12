from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return  user

class User(AbstractBaseUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=255, unique=True, default='')
    first_name = models.CharField(default='', max_length=255)
    last_name = models.CharField(default='', max_length=255)
    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']


    def __str__(self):
       return self.username