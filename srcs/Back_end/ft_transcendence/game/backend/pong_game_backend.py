from typing import Dict
from login.models import User
from game.models import Game
from channels.layers import get_channel_layer
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async

class paddel:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.speed = 10
        self.width = 10
        self.height = 100
    
    
class PongGame:
    def __init__(self, game: Game, room_name):
        self.game = game
        self.room_name = room_name
        self.score1 = None
        self.score2 = None
        self.paddle1 = paddel(0, 50)
        self.paddle2 = paddel(200, 50)
        self.ball = {'x': 100, 'y': 50, 'speed_x': 1, 'speed_y': 1}
        self.player1 = None
        self.player2 = None

    async def initialize(self):
        self.score1 = await sync_to_async(lambda: self.game.score1)()
        self.score2 = await sync_to_async(lambda: self.game.score2)()

    async def join(self, player: User):
        player1_username = await sync_to_async(lambda: self.game.player1.username)()
        player2_username = await sync_to_async(lambda: self.game.player2.username)()
        
        if player1_username == player.username:
            self.player1 = player
        elif player2_username == player.username:
            self.player2 = player
        
        if self.player1 and self.player2:
            await self.group_send({
                'type': 'start_game',
                'stats': self.get_stats()
            })
            
    async def group_send(self, event):
        channel_layer = get_channel_layer()
        await channel_layer.group_send(
            self.room_name,
            event
        )
    
    async def start_game(self):
        pass

    def get_stats(self):
        return {
            'paddle1': self.paddle1.y,
            'paddle2': self.paddle2.y,
            'ball': {
                'x': self.ball['x'],
                'y': self.ball['y']
            },
            'score1': self.score1,
            'score2': self.score2,
        }

class PongGameManager:
    def __init__(self):
        self.games: Dict[str, PongGame] = {}
    
    async def add_player_to_game(self, game: Game, player: User, room_name: str) -> bool:
        '''Adds a player to the specified game. If the game does not exist, it creates a new game.'''
        if room_name not in self.games:
            self.games[room_name] = PongGame(game, room_name)
            await self.games[room_name].initialize()
        await self.games[room_name].join(player)
    
    async def remove_player_from_game(self, room_name, player_id):
        '''Finish the game and make this player luses.'''
        pass

    def get_stats(self, room_name):
        return self.games[room_name].get_stats()
