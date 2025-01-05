
from django.db import models
from login.models import User
from django.conf import settings
from datetime import timedelta
from django.utils import timezone


class Conversation(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="convo_starter")
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="convo_participant")
    last_message_time = models.DateTimeField(auto_now_add=True)
    content_of_last_message = models.TextField(null=True)

    class Meta:
        ordering = ('-last_message_time',)

    def __str__(self):
        return f"{self.sender} -> {self.receiver}"

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, related_name='messages', on_delete=models.CASCADE, null=True)
    sender = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='received_messages', null=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    link = models.TextField(default="link", null=True, blank=True)

    @property
    def is_link_expired(self):
        """Check if the link has expired (5 minutes after creation)."""
        expiration_time = self.created_at + timedelta(minutes=5)
        return timezone.now() > expiration_time

    def __str__(self):
        return f"{self.sender}: {self.message[:50]}"

    class Meta:
        ordering = ('-created_at',)
