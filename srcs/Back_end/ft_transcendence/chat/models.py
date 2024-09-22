
from django.db import models
from login.models import User
from django.conf import settings



class Conversation(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="convo_starter")
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="convo_participant")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created_at',)#the last one will apears# hadui rah normalement khassna nchofo akhir message machi imta tcreate l conversation

    def __str__(self):
        return f"{self.sender} -> {self.receiver}"

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, null=True)
    sender = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='sent_messages')#ila drt on_delete=models.CASCADE ya3ni m3a ghanms7 user ghaytms7 kolchi les messages m3ah
    receiver = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='received_messages', null=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    # is_read = models.BooleanField(default=False)
    # is_blocked =models.BooleanField(default=False)

    def __str__(self):
        return f"{self.sender}: {self.message[:50]}"

    class Meta:
        ordering = ('-created_at',)#the last one will apears
