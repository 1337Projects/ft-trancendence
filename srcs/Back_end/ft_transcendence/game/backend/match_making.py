import asyncio
from collections import deque
from channels.layers import get_channel_layer
from tournment.models import Player
from channels.db import database_sync_to_async
from game.models import Game
from login.models import User

class MatchMaking:

    def __init__(self):
        self.waiting_players = deque()
    
    async def check_for_match(self, player: User, channel_name: str):
        if len(self.waiting_players) >= 1:
            waited_player, channel2 = self.waiting_players.popleft()
            game_id = await self.create_match(player, waited_player)
            await self.game_start_message(channel_name, game_id)
            await self.game_start_message(channel2, game_id)
        else:
            self.waiting_players.append((player, channel_name))

    @database_sync_to_async
    def create_match(self, player1: int, player2: int):
        game = Game(player1=player1, player2=player2)
        game.save()
        return game.id

    async def game_start_message(self, channel_name: str, game_id: int):
        channel_layer = get_channel_layer()
        await channel_layer.send(channel_name, {
            'type': 'game_start',
            'game_id': game_id,
        })