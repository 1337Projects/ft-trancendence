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
    account_id = models.CharField(default=0)
    password = models.CharField(max_length=10, default=make_password('default_password'))
    objects = UserManager()

# class Profile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     bio = models.TextField(default='', blank=True)
#     exp = models.IntegerField(default=0)
#     avatar = models.CharField(default='')
#     image = models.CharField(unique=True, default='')
#     online = models.BooleanField(default=False)
#     groups = None
#     user_permissions = None
  