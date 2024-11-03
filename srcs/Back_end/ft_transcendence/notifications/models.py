from django.db import models
from django.conf import settings

class GameRequest(models.Model):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sent_game_requests")

    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="received_game_requests")

    message = models.TextField(default="You have a new game request!")
    is_accepted = models.BooleanField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Game Request from {self.sender} to {self.receiver} - Accepted: {self.is_accepted}"

    class Meta:
        ordering = ['-created_at']
