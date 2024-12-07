import json
from channels.generic.websocket import AsyncWebsocketConsumer
from collections import deque
from login.models import User
import sys

from game.backend.match_making import MatchMaking

class MatchmakingConsumer(AsyncWebsocketConsumer):
    matchmaking = MatchMaking()

    async def connect(self):
        self.player: User = self.scope['user']
        await self.accept()
        await self.matchmaking.check_for_match(self.player, self.channel_name)
    
    async def disconnect(self, close_code: int):
        await self.matchmaking.remove_player(self.player)
    
    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)

    async def game_start(self, event: dict):
        game_id = event['game_id']
        await self.send(text_data=json.dumps({
            'game_id': game_id,
        }))