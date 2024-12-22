import pytest
from login.models import User
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from rest_framework.test import APIClient
from ft_transcendence.asgi import application
from channels.testing import WebsocketCommunicator
from .models import Game

from login.serializer import UserSerializer

import sys

def print_data(data):
    print(data)
    sys.stdout.flush()

@pytest.mark.django_db
@pytest.mark.asyncio
class Test_MatchmakingConsumer:
    """Test class for MatchmakingConsumer."""

    async def create_user(self, username, email, password, first_name, last_name) -> User:
        """Create a new user and return user and access_token."""
        user = await database_sync_to_async(User.objects.create_user)(
            email=email,
            username=username,
            first_name=first_name,
            last_name=last_name,
            password=password,
        )
        
        assert user.email == email 
        assert user.username == username 
        assert user.first_name == first_name 
        assert user.last_name == last_name 
        assert user.check_password(password)
        
        client = APIClient()
        response = await sync_to_async(client.post)('/api/users/api/login/', {
            'email': email,
            'password': password
        }, format='json')
        
        assert response.status_code == 200
        access_token = response.data['access']
        return user, access_token

    async def connected_communicator(self, access_token: str):
        """Get communicator object."""
        communicator = WebsocketCommunicator(application, f'/wss/match_making/?token={access_token}')
        connected, subprotocol = await communicator.connect()
        assert connected
        return communicator

    async def test_matchmaking_consumer(self):
        user1, token1 = await self.create_user("player1", "player1@example.com", "password123", "Player1", "Player1")
        user2, token2 = await self.create_user("player2", "player2@example.com", "password123", "Player2", "Player1")

        communicator1 = await self.connected_communicator(token1)
        communicator2 = await self.connected_communicator(token2)

        response1 = await communicator1.receive_json_from()
        assert response1 == {'message': f'Welcome {user1.username}!'}
        response2 = await communicator2.receive_json_from()
        assert response2 == {'message': f'Welcome {user2.username}!'}
        response2 = await communicator2.receive_json_from()
        print(response2)
        game_id = response2['game_id']
        message = response2['message']
        assert message == f"Game started! Your game ID is {game_id}"

        # check if game is created
        game: Game = await database_sync_to_async(Game.objects.get)(id=game_id)
        player1 = await database_sync_to_async(lambda: game.player1)()
        player2 = await database_sync_to_async(lambda: game.player2)()
        assert player1 == user1
        assert player2 == user2
        await communicator1.disconnect()
        await communicator2.disconnect()

