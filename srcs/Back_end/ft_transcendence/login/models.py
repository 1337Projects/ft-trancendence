from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.conf import settings
from django_otp.plugins.otp_totp.models import TOTPDevice

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
    twofa = models.BooleanField(default=False)
    secret_key = models.CharField(max_length=64, default='')
    objects = UserManager()
    google_or_intra = models.BooleanField(default=False)
    last_notification_seen = models.DateTimeField(blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']


    def __str__(self):
       return self.username

class PasswordReset(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(unique=True)
    is_used = models.BooleanField(default=False)

# class BlockedUser(models.Model):
#     blocker = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="blocked_users")
#     blocked = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="blocked_by")


#     class Meta:
#         unique_together = ('blocker', 'blocked')
