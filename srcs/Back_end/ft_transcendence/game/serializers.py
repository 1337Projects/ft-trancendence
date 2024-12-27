from rest_framework import serializers
from .models import Game
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