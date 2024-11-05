
from login.serializer import UserSerializer
from .models import Conversation, Message
from rest_framework import serializers
from account.serializer import *



class MessageSerializer(serializers.ModelSerializer):
    sender = UserWithProfileSerializer()
    receiver = UserWithProfileSerializer()
    class Meta:
        model = Message
        fields = ['id', 'message', 'created_at', 'sender', 'receiver']


class ConversationListSerializer(serializers.ModelSerializer):
    sender = UserWithProfileSerializer()
    receiver = UserWithProfileSerializer()
    last_message_time = serializers.DateTimeField()
    content_of_last_message = serializers.CharField()

    class Meta:
        model = Conversation
        fields = ['id', 'sender', 'receiver', 'content_of_last_message', 'last_message_time']


class ConversationSerializer(serializers.ModelSerializer):
    sender = UserWithProfileSerializer()
    receiver = UserWithProfileSerializer()
    message_ser = MessageSerializer(many=True, read_only=True, source='messages')

    class Meta:
        model = Conversation
        fields = ['id', 'sender', 'receiver', 'message_ser']
