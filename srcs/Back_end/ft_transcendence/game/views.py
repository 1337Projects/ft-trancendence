from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Game
from .serializers import UserGameStatsSerializer, GameSerializer
from django.db.models import Q

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_game_stats(request):
    user = request.user
    games_played = Game.objects.filter(Q(player1=user) | Q(player2=user)).count()
    games_won = Game.objects.filter(winner=user).count()
    games_lost = games_played - games_won

    data = {
        'games_played': games_played,
        'games_won': games_won,
        'games_lost': games_lost,
    }

    serializer = UserGameStatsSerializer(data)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_game_history(request):
    user = request.user
    games = Game.objects.filter(Q(player1=user) | Q(player2=user)).order_by('-created_at')
    serializer = GameSerializer(games, many=True)
    return Response(serializer.data)
