from rest_framework import serializers
from .models import Game, Game1
from login.models import User
from account.serializer import UserWithProfileSerializer

class GameSerializer(serializers.ModelSerializer):

    queryset = User.objects.all()
    player1 = serializers.PrimaryKeyRelatedField(queryset=queryset)
    player2 = serializers.PrimaryKeyRelatedField(queryset=queryset)


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['player1'] = UserWithProfileSerializer(instance.player1).data
        representation['player2'] = UserWithProfileSerializer(instance.player2).data
        return representation

    class Meta:
        model = Game
        fields = '__all__'


class TicTacTeoSerializer(serializers.ModelSerializer):

    queryset = User.objects.all()
    player1 = serializers.PrimaryKeyRelatedField(queryset=queryset)
    player2 = serializers.PrimaryKeyRelatedField(queryset=queryset)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['player1'] = UserWithProfileSerializer(instance.player1).data
        representation['player2'] = UserWithProfileSerializer(instance.player2).data
        return representation

    class Meta:
        model = Game1
        fields = '__all__'

class UserGameStatsSerializer(serializers.Serializer):
    games_played = serializers.IntegerField()
    games_won = serializers.IntegerField()
    games_lost = serializers.IntegerField()