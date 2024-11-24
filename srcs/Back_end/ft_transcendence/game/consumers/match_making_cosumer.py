import json
from channels.generic.websocket import AsyncWebsocketConsumer
from collections import deque
from login.models import User
import sys

from game.backend.match_making import MatchMaking

def print_data(data):
    print(data)
    sys.stdout.flush()

class MatchmakingConsumer(AsyncWebsocketConsumer):
    matchmaking = MatchMaking()

    async def connect(self):
        self.player: User = self.scope['user']
        await self.accept()
        await self.send(text_data=json.dumps({
            'message': f'Welcome {self.player.username}!'
        }))
        await self.matchmaking.check_for_match(self.player, self.channel_name)
    
    async def disconnect(self, close_code: int):
        self.matchmaking.waiting_players = deque(filter(lambda x: x[0] != self.player.username, self.matchmaking.waiting_players))
        print(f'{self.player.username} disconnected')
    
    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        print(f'player {self.player.username} received: {data}')

    async def game_start(self, event: dict):
        game_id = event['game_id']
        await self.send(text_data=json.dumps({
            'game_id': game_id,
            'message': f"Game started! Your game ID is {game_id}",
        }))