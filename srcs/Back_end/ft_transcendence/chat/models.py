
from django.db import models
from login.models import User
from django.conf import settings


class Conversation(models.Model):
    initiator = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="convo_starter"
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="convo_participant"
    )
    start_time = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE,)
    sender = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='sent_messages')#ila drt on_delete=models.CASCADE ya3ni m3a ghanms7 user ghaytms7 kolchi les messages m3ah
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)


    # conversation_id = models.ForeignKey(Conversation, on_delete=models.CASCADE,)
    # receiver = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='received_messages')
    # is_read = models.BooleanField(default=False)
    # is_blocked =models.BooleanField(default=False)

    class Meta:
        ordering = ('-timestamp',)#the last one will apears