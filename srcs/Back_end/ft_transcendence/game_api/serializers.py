

from rest_framework import serializers
from .models import Match
from login.models import User
from account.serializer import UserWithProfileSerializer


class MatchSerializer(serializers.ModelSerializer):
    queryset = User.objects.all()
    player_1 = serializers.PrimaryKeyRelatedField(queryset=queryset)
    player_2 = serializers.PrimaryKeyRelatedField(queryset=queryset)


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['player_1'] = UserWithProfileSerializer(instance.player_1).data
        representation['player_2'] = UserWithProfileSerializer(instance.player_2).data
        return representation


    class Meta:
        model = Match
        fields = ['id', 'player_1', 'player_2', 'player_score_1', 'player_score_2', 'winner']
    