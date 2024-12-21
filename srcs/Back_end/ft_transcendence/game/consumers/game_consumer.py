import json
import sys
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from game.backend.pong_game_backend import PongGameManager
from game.models import Game
from channels.db import database_sync_to_async
from login.models import User
from icecream import ic

class GameConsumer(AsyncWebsocketConsumer):
    pongGameManager = PongGameManager()

    async def connect(self):
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.player = self.scope['user']
        self.room_name = f'game_{self.game_id}'

        ic(self.player.username, "Connecting")
        sys.stdout.flush()

        game = await database_sync_to_async(Game.objects.get)(id=self.game_id)

        player1_id = await database_sync_to_async(lambda: game.player1.id)()
        player2_id = await database_sync_to_async(lambda: game.player2.id)()

        if self.player.id != player1_id and self.player.id != player2_id:
            await self.close(code=4000)
            return

        self.channel_layer = get_channel_layer()
        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )
        await self.accept()
        game_is_full = await self.pongGameManager.add_player_to_game(game, self.player, self.room_name)
        if game_is_full:
            await self.init_game()
            asyncio.create_task(self.game_loop())
    
    async def disconnect(self, close_code):
        """ Handles the WebSocket disconnection for a game."""
        ic(self.player.username, "Disconnecting", close_code)
        sys.stdout.flush()
        if close_code == 1000:
            await self.channel_layer.group_discard(
                self.room_name,
                self.channel_name
            )
        else:
            pass

    async def game_loop(self):
        ic(self.player.username, "Game loop started")
        sys.stdout.flush()
        # for i in range(100):
        #     await asyncio.sleep(1 / 60)
        #     # self.pongGameManager.update(self.room_name)
        #     await self.broadcast_stats()

    async def group_send(self, event):
        await self.channel_layer.group_send(
            self.room_name,
            event
        )
        
    async def init_game(self):
        ic(self.player.username, "Initializing game")
        # ic(stats)
        sys.stdout.flush()
        event = {
            'type': 'broad_cast',
            'event': 'init_game',
        }
        event.update(self.pongGameManager.get_init(self.room_name))
        await self.group_send(event)

    async def broad_cast(self, event):
        await self.send(text_data=json.dumps(event))
