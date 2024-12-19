
from rest_framework import serializers
from .models import Tournment
from login.models import User
from login.serializer import UserSerializer
from account.serializer import UserWithProfileSerializer


class TournmentSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        representation =  super().to_representation(instance)
        representation['players'] = UserWithProfileSerializer(instance.players.all(), many=True).data
        return representation

    class Meta:
        model = Tournment
        fields = ["id", "tournament_name", "tourament_status", "created_at", "max_players"]