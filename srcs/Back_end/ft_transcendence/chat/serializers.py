
from .models import Conversation, Message
from rest_framework import serializers
from account.serializer import *



class MessageSerializer(serializers.ModelSerializer):
    sender = UserWithProfileSerializer()
    receiver = UserWithProfileSerializer()
    link_expired = serializers.BooleanField(source='is_link_expired', read_only=True)
    link = serializers.SerializerMethodField()

    def get_link(self, obj):
        if obj.is_link_expired:
            return None
        return obj.link

    class Meta:
        model = Message
        fields = ['id', 'message', 'created_at', 'sender', 'receiver', 'link', 'link_expired']



class ConversationSerializer(serializers.ModelSerializer):
    sender = UserWithProfileSerializer()
    receiver = UserWithProfileSerializer()
    last_message_time = serializers.DateTimeField()
    content_of_last_message = serializers.CharField()

    class Meta:
        model = Conversation
        fields = ['id', 'sender', 'receiver', 'last_message_time', 'content_of_last_message']
