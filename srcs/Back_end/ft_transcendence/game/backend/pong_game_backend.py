from typing import Dict
from login.models import User
from game.models import Game
from channels.layers import get_channel_layer
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from enum import Enum

# Define constants
    # Screen
SCREEN_WIDTH = 400
SCREEN_HEIGHT = 800
    # Paddle
PADDLE_WIDTH = 100 # could be pair (2k)
PADDLE_HEIGHT = 20 # could be pair (2k)
PADDLE_SPEED = 5
    # Ball
BALL_SIZE = 10
FPS = 60

class PaddlePlayer(Enum):
    PLAYER_1_PADDLE = 1
    PLAYER_2_PADDLE = 2

class Paddle:
    def __init__(self, player: PaddlePlayer):
        self.paddlePlayer = player
        self.x = SCREEN_WIDTH // 2
        if player == PaddlePlayer.PLAYER_1_PADDLE:
            self.y = 0  # paddle 1 is at the top
        else:
            self.y = SCREEN_HEIGHT - PADDLE_HEIGHT # paddle 2 is at the bottom
        self.speed = PADDLE_SPEED
        self.width = PADDLE_WIDTH
        self.height = PADDLE_HEIGHT
    
 
    def get_demensions(self):
        if self.paddlePlayer == PaddlePlayer.PLAYER_1_PADDLE:
            side = "top"
        else:
            side = "bottom"
        return {
            'height': self.height,
            'width': self.width,
            'x': self.x,
            'y': self.y,
            'side': side
        }

class Ball:
    def __init__(self):
        self.x = SCREEN_WIDTH // 2
        self.y = SCREEN_HEIGHT // 2
        self.speed_x = 5
        self.speed_y = 5
    



class PongGame:
    def __init__(self, game: Game, room_name):
        self.width = SCREEN_WIDTH
        self.height = SCREEN_HEIGHT
        self.game = game
        self.room_name = room_name
        self.score1 = None
        self.score2 = None
        self.paddle1 = Paddle(PaddlePlayer.PLAYER_1_PADDLE)
        self.paddle2 = Paddle(PaddlePlayer.PLAYER_2_PADDLE)
        # self.ball = Ball()
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
        
        return self.player1 and self.player2
    
    def check_collision(self, x, y):
        pass
        

    def update(self, player):
        next_x = self.ball['x'] + self.ball['speed_x']
        next_y = self.ball['y'] + self.ball['speed_y']


    def get_stats(self):
        stats = {}
        stats.update(self.paddle1.get_position())
        stats.update(self.paddle2.get_position())
        stats['score1'] = self.score1
        stats['score2'] = self.score2
        return stats

    def get_init(self):
        '''
        return the initial state of the game.
        '''
        paddles = {
            'paddle1X': self.paddle1.x,
            'paddle2X': self.paddle2.x,
            'width': self.paddle1.width,
            'height': self.paddle1.height
        }
        game = {
            'width': self.width,
            'height': self.height
        }
        return {
            'paddles': paddles,
            'game': game
        }
        
        

class PongGameManager:
    def __init__(self):
        self.games: Dict[str, PongGame] = {}
    
    async def add_player_to_game(self, game: Game, player: User, room_name: str) -> bool:
        '''
        Adds a player to the specified game. If the game does not exist, it creates a new game.
        return True if the second player joined the game, False otherwise.
        '''
        if room_name not in self.games:
            self.games[room_name] = PongGame(game, room_name)
            await self.games[room_name].initialize()
        return await self.games[room_name].join(player)
    
    async def remove_player_from_game(self, room_name, player_id):
        '''Finish the game and make this player luses.'''
        pass

    def get_stats(self, room_name):
        return self.games[room_name].get_stats()

    def get_init(self, room_name):
        '''
        get the init stat of the game.
        '''
        return self.games[room_name].get_init()
    
    def get_paddles_demension(self, room_name):
        return self.games[room_name].get_paddles_demension()