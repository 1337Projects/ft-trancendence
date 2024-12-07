import pytest
from login.models import User
from channels.db import database_sync_to_async
from channels.testing import WebsocketCommunicator
from game.models import Game
from ft_transcendence.asgi import application
from rest_framework.test import APIClient
from asgiref.sync import sync_to_async
from django.test import TestCase
from django.contrib.auth import get_user_model
import asyncio

User = get_user_model()

@pytest.mark.django_db
@pytest.mark.asyncio
class TestGame:
    async def create_player(self, email, username):
        player = await sync_to_async(User.objects.create_user)(
            email=email,
            username=username,
            first_name='player',
            last_name='player',
            password='pass123'
        )
        client = APIClient()
        response = await sync_to_async(client.post)('/users/api/login/', {
            'email': email,
            'password': 'pass123'
        }, format='json')
        assert response.status_code == 200
        token = response.data['access']
        return player, token

    async def create_game(self, player1, player2):
        game = await database_sync_to_async(Game.objects.create)(
            player1=player1,
            player2=player2,
        )
        return game

    async def connected_communicator(self, access_token, game_id):
        communicator = WebsocketCommunicator(application, f'/ws/game/{game_id}/?token={access_token}')
        connected, subprotocol = await communicator.connect()
        assert connected
        return communicator

    def check_init_stats(self, stats):
        assert stats['paddle1'] == 50
        assert stats['paddle2'] == 50
        assert stats['ball']['x'] == 100
        assert stats['ball']['y'] == 50
        assert stats['score1'] == 0
        assert stats['score2'] == 0
    

    async def test_game_consumer(self):
        player1, token1 = await self.create_player('p1@example.com', 'p1')
        player2, token2 = await self.create_player('p2@example.com', 'p2')

        game = await self.create_game(player1, player2)
        communicator1 = await self.connected_communicator(token1, game.id)      
        communicator2 = await self.connected_communicator(token2, game.id)

        response1 = await communicator1.receive_json_from()
        stats = response1['stats']
        self.check_init_stats(stats)
        try:
            # Add further test logic here
            pass
        finally:
            await communicator1.disconnect()
            await communicator2.disconnect()


