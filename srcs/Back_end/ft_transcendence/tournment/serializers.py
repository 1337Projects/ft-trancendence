
from rest_framework import serializers
from .models import Tournment, Player
from login.models import User
from login.serializer import UserSerializer


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ["id", "name", "user_id", "avatar"]

class TournmentSerializer(serializers.ModelSerializer):

    queryset = User.objects.all()
    owner = serializers.PrimaryKeyRelatedField(queryset=queryset)

    def to_representation(self, instance):
        representation =  super().to_representation(instance)
        representation['players'] = PlayerSerializer(instance.players.all(), many=True).data
        representation['owner'] =  UserSerializer(instance.owner).data
        return representation

    class Meta:
        model = Tournment
        fields = ["id", "mode", "max_players", "owner"]