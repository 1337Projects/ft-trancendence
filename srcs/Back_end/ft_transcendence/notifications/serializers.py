from rest_framework import serializers
from .models import GameRequest



class GameRequestSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    receiver_username = serializers.CharField(source='receiver.username', read_only=True)
    link = serializers.SerializerMethodField()

    class Meta:
        model = GameRequest
        fields = ['id', 'sender', 'sender_username', 'receiver', 'receiver_username', 'message', 'is_accepted', 'is_read', 'created_at', 'link']
    
    def get_link(self, obj):
        if obj.is_link_expired:
            return None
        return obj.link


