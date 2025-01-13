import json
import sys
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from game.backend.pong_game_backend import PongGameManager
from game.models import Game
from game.serializers import GameSerializer
from channels.db import database_sync_to_async
from login.models import User
from icecream import ic

class GameConsumer(AsyncWebsocketConsumer):
    pongGameManager = PongGameManager()

    async def connect(self):
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.player = self.scope['user']
        self.room_name = f'game_{self.game_id}'

        # ic(self.player.username, "Connecting")
        # sys.stdout.flush()

        self.game = await database_sync_to_async(Game.objects.get)(id=self.game_id)

        player1_id = await database_sync_to_async(lambda: self.game.player1.id)()
        player2_id = await database_sync_to_async(lambda: self.game.player2.id)()

        if self.player.id != player1_id and self.player.id != player2_id:
            await self.close(code=4000)
            return

        self.channel_layer = get_channel_layer()
        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )
        await self.accept()
        game_is_full = await self.pongGameManager.add_player_to_game(self.game, self.player, self.room_name)
        if game_is_full:
            await self.init_game()
            asyncio.create_task(self.game_loop())
    
    async def receive(self, text_data=None):
        data = json.loads(text_data)
        event_type = data.get('event')
        if event_type == 'movePaddle':
            key = data.get('key')
            self.pongGameManager.move_player(self.room_name, self.player.id, key)
            # await self.send_stats()
 
    async def send_stats(self):
        # ic('send_stats')
        # sys.stdout.flush()
        stats = self.pongGameManager.get_stats(self.room_name)
        event = {
            'type': 'broad_cast',
            'event': 'update',
            'stats': stats
        }
        await self.group_send(event)
 
    async def disconnect(self, close_code):
        """ Handles the WebSocket disconnection for a game."""
        score = None
        if self.player.id == self.game.player1.id:
            score = {
                'score1': 0,
                'score2': 5
            }
        else:
            score = {
                'score1': 5,
                'score2': 0
            }
        game_data = await self.end_game(score)
        event = {
            'type': 'broad_cast',
            'event': 'end_game',
            'game_data': game_data
        }
        self.pongGameManager.end_game(self.room_name)
        await self.group_send(event)
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )

    async def game_loop(self):
        # ic(self.player.username, "Game loop started")
        # sys.stdout.flush()
        while self.pongGameManager.game_is_starting(self.room_name):
            await asyncio.sleep(1 / 40)
            score = self.pongGameManager.update(self.room_name)
            if score:
                # ic(score)
                # sys.stdout.flush()
                await self.send_score(score)
                if score['score1'] >= 5 or score['score2'] >= 5:
                    game_data = await self.end_game(score)
                    event = {
                        'type': 'broad_cast',
                        'event': 'end_game',
                        'game_data': game_data
                    }
                    self.pongGameManager.end_game(self.room_name)
                    await self.group_send(event)
            await self.send_stats()

    @database_sync_to_async
    def end_game(self, score):
        # game: Game = Game.objects.get(id=self.game_id)
        self.game.score1 = score['score1']
        self.game.score2 = score['score2']
        if score['score1'] > score['score2']:
            self.game.winner = self.game.player1
            self.game.loser = self.game.player2
        else:
            self.game.winner = self.game.player2
            self.game.loser = self.game.player1
        self.game.save()
        serializer = GameSerializer(self.game)
        game_data = serializer.data
        return game_data

    async def send_score(self, score):
       event = {
           'type': 'broad_cast',
           'event': 'set_score',
           'score': score
       }
       await self.group_send(event)

    async def group_send(self, event):
        await self.channel_layer.group_send(
            self.room_name,
            event
        )
        
    async def init_game(self):
        # ic(self.player.username, "Initializing game")
        # sys.stdout.flush()
        game_serializer = GameSerializer(self.game)
        game_data = await database_sync_to_async(lambda: game_serializer.data)()
        event = {
            'type': 'broad_cast',
            'event': 'init_game',
            'game_data': game_data
        }
        event.update(self.pongGameManager.get_init(self.room_name))
        await self.group_send(event)

    async def broad_cast(self, event):
        await self.send(text_data=json.dumps(event))
