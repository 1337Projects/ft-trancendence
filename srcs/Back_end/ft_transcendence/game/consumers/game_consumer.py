import json
import math
import sys
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from game.backend.pong_game_backend import PongGameManager
from game.models import Game
from game.serializers import GameSerializer
from channels.db import database_sync_to_async
from login.models import User
from account.models import ExperienceLog, Profile
from icecream import ic
from django.db import models

class GameConsumer(AsyncWebsocketConsumer):
    pongGameManager = PongGameManager()

    async def connect(self):
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.player = self.scope['user']
        self.room_name = f'game_{self.game_id}'

        self.game = await database_sync_to_async(Game.objects.get)(id=self.game_id)

    
        player1_id = await database_sync_to_async(lambda: self.game.player1.id)()
        player2_id = await database_sync_to_async(lambda: self.game.player2.id)()

        if self.player.id != player1_id and self.player.id != player2_id:
            await self.close(code=4000)
            return

        self.channel_layer = get_channel_layer()
        status = self.pongGameManager.get_game_status(self.room_name)
        if status == 'end':
            await self.disconnect(10)
            return
        await self.accept()
        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )
        game_is_full = await self.pongGameManager.add_player_to_game(self.game, self.player, self.room_name)

        self.timeout_task = None
        if game_is_full:
            await self.init_game()
            asyncio.create_task(self.game_loop())
            return

        self.timeout_task = asyncio.create_task(self.player_timeout())

    async def player_timeout(self):
        await asyncio.sleep(3)  # Set timeout period (e.g., 30 seconds)
        await self.disconnect(4001, timeout=True)  # Disconnect the player if timeout expires
    
    async def receive(self, text_data=None):
        data = json.loads(text_data)
        event_type = data.get('event')
        if event_type == 'movePaddle':
            key = data.get('key')
            self.pongGameManager.move_player(self.room_name, self.player.id, key)
            # await self.send_stats()
 
    async def send_stats(self):
        # ic(stats)
        # sys.stdout.flush()
        stats = self.pongGameManager.get_stats(self.room_name)
        event = {
            'type': 'broad_cast',
            'event': 'update',
            'stats': stats
        }
        await self.group_send(event)

    async def disconnect_in_game(self):
        if self.player.id == self.game.player1.id:
            score = { 'score1': 0, 'score2': 5 }
        else:
            score = { 'score1': 5, 'score2': 0 }
        game_data = await self.end_game(score)
        event = {
            'type': 'broad_cast',
            'event': 'end_game',
            'game_data': game_data
        }
        self.pongGameManager.end_game(self.room_name)
        await self.group_send(event)
        
    async def timeout_disconnect(self):
        if self.player.id == self.game.player1.id:
            score = { 'score1': 5, 'score2': 0 }
        else:
            score = { 'score1': 0, 'score2': 5 }
        game_data = await self.end_game(score)
        event = {
            'type': 'broad_cast',
            'event': 'end_game',
            'game_data': game_data
        }
        self.pongGameManager.end_game(self.room_name)
        await self.group_send(event)

    async def disconnect(self, close_code, timeout=False):
        """
        Handles the WebSocket disconnection for a game.

        Args:
            close_code (int): The WebSocket close code.
            timeout (bool): A flag indicating if the disconnection was due to a timeout.

        Behavior:
            - If the disconnection is due to a timeout, the player is set as the winner.
            - If the game is still ongoing, the game is ended and the player is set as the loser.
            - If the game has already ended, no additional actions are taken.
            - The player is removed from the channel group.
        """
        player = self.player.username
        ic(player, close_code, timeout)
        sys.stdout.flush()
        if timeout:
            # Set the player as the winner if they disconnect due to a timeout
            # ic(player, 'timeout disconect game')
            await self.timeout_disconnect()
        elif self.pongGameManager.get_game_status(self.room_name) != 'end':
            # ic(player, 'disconect in game')
            await self.disconnect_in_game()
        # else:
        #     ic(player, 'disconect after game')

        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )

    async def game_loop(self):
        speed_increment_time = 0
        while self.pongGameManager.game_is_starting(self.room_name):
            await asyncio.sleep(1 / 40)
            score = self.pongGameManager.update(self.room_name)
            if score:
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
            current_time = asyncio.get_event_loop().time()
            if current_time - speed_increment_time >= 5:
                self.pongGameManager.increse_speed(self.room_name)
                speed_increment_time = current_time
            await self.send_stats()

    @database_sync_to_async
    def end_game(self, score):
        self.game.score1 = score['score1']
        self.game.score2 = score['score2']
        if score['score1'] > score['score2']:
            self.game.winner = self.game.player1
            self.game.loser = self.game.player2
        else:
            self.game.winner = self.game.player2
            self.game.loser = self.game.player1
        self.game.save()
        
        self.add_xp(self.game.winner.profile, 100)
        self.add_xp(self.game.loser.profile, 20)
        serializer = GameSerializer(self.game)
        game_data = serializer.data
        return game_data
    
    def add_xp(self, profile: Profile, xp: int):
        # profile: Profile = Profile.objects.get(user=player)
        
        ExperienceLog.objects.create(profile=profile, experience_gained=xp)
        total_xp = ExperienceLog.objects.filter(profile=profile).aggregate(total=models.Sum('experience_gained'))['total']
        profile.level = round(math.sqrt(total_xp / 100), 1)
        profile.save()

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
        if event['event'] == 'init_game':
            if self.timeout_task != None:
                self.timeout_task.cancel()
            # ic('timeout is cancled form ', self.player.username)
        await self.send(text_data=json.dumps(event))
