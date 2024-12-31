from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

class GameRequest(models.Model):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sent_game_requests")

    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="received_game_requests")

    message = models.TextField(default="You have a new game request!")
    is_accepted = models.BooleanField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    link = models.TextField(default="link")

    @property
    def is_link_expired(self):
        """Check if the link has expired (5 minutes after creation)."""
        expiration_time = self.created_at + timedelta(minutes=5)
        return timezone.now() > expiration_time

    def __str__(self):
        return f"Game Request from {self.sender} to {self.receiver} - Accepted: {self.is_accepted}"

    class Meta:
        ordering = ['-created_at']
