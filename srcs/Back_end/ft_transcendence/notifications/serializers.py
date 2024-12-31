from rest_framework import serializers
from .models import GameRequest
from datetime import timedelta, datetime
from tournment.utils import debug



class GameRequestSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    receiver_username = serializers.CharField(source='receiver.username', read_only=True)
    link_expired = serializers.BooleanField(source='is_link_expired', read_only=True)
    link = serializers.SerializerMethodField()

    class Meta:
        model = GameRequest
        fields = ['id', 'sender', 'sender_username', 'receiver', 'receiver_username', 'message', 'is_accepted', 'is_read', 'created_at', 'link', 'link_expired']
    
    def get_link(self, obj):
        if obj.is_link_expired:
            return None
        return obj.link

    # expired = serializers.SerializerMethodField()

    # def get_expired(self, obj):
    #     exp_date = obj.created_at + timedelta(minutes=5)
    #     return exp_date < datetime.now()

    # def to_representation(self, instance):
    #     representation = super().to_representation(instance)
    #     exp_date = instance.created_at + timedelta(minutes=5)
    #     # debug(exp_date)
    #     # now = datetime.now()
    #     representation['expired'] = exp_date
    #     return representation

