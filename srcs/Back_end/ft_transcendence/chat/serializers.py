
from login.serializer import UserSerializer
from .models import Conversation, Message
from rest_framework import serializers
from account.serializer import *



class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer()
    receiver = UserSerializer()
    class Meta:
        model = Message
        # exclude = ('conversation')
        fields = ['id', 'message', 'created_at', 'sender', 'receiver']


class ConversationListSerializer(serializers.ModelSerializer):
    # sender = UserSerializer()
    sender = UserWithProfileSerializer()
    
    # receiver = UserSerializer()
    receiver = UserWithProfileSerializer()
    # last_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['sender', 'receiver']
        # fields = ['sender', 'receiver', 'last_message']

    # def get_last_message(self, instance):
    #     message = instance.message_ser.first()
    #     if message:
    #         return MessageSerializer(message).data
    #     return None


class ConversationSerializer(serializers.ModelSerializer):
    sender = UserSerializer()
    receiver = UserSerializer()
    message_ser = MessageSerializer(many=True)

    class Meta:
        model = Conversation
        fields = ['id','sender', 'receiver','created_at', 'message_ser']
