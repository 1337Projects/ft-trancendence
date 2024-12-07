
from rest_framework import serializers
from .models import Tournment
from login.models import User
from login.serializer import UserSerializer
from account.serializer import UserWithProfileSerializer


class TournmentSerializer(serializers.ModelSerializer):

    queryset = User.objects.all()
    owner = serializers.PrimaryKeyRelatedField(queryset=queryset)

    def to_representation(self, instance):
        representation =  super().to_representation(instance)
        representation['players'] = UserWithProfileSerializer(instance.players.all(), many=True).data
        representation['owner'] =  UserSerializer(instance.owner).data
        return representation

    class Meta:
        model = Tournment
        fields = ["id", "mode", "max_players", "owner"]