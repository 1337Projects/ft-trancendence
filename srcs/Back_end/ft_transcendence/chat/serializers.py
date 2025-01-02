
from .models import Conversation, Message
from rest_framework import serializers
from account.serializer import *



class MessageSerializer(serializers.ModelSerializer):
    sender = UserWithProfileSerializer()
    receiver = UserWithProfileSerializer()
    class Meta:
        model = Message
        fields = ['id', 'message', 'created_at', 'sender', 'receiver', 'link']



class ConversationSerializer(serializers.ModelSerializer):
    sender = UserWithProfileSerializer()
    receiver = UserWithProfileSerializer()
    last_message_time = serializers.DateTimeField()
    content_of_last_message = serializers.CharField()

    class Meta:
        model = Conversation
        fields = ['id', 'sender', 'receiver', 'last_message_time', 'content_of_last_message']
