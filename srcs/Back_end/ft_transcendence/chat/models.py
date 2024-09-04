from django.db import models
from login.models import User
from django.conf import settings


class Conversation(models.Model):
    user_sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="convo_starter"
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="convo_participant"
    )
    start_time = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    message_id = models.ForeignKey(Conversation, on_delete=models.CASCADE,)
    user_sender = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='sent_messages')#ila drt on_delete=models.CASCADE ya3ni m3a ghanms7 user ghaytms7 kolchi les messages m3ah
    user_receiver = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='received_messages')
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    is_blocked =models.BooleanField(default=False)
    # is_archived = models.BooleanField(default=False)

class Meta:
    ordering = ('-timestamp',)