from typing import Dict
from login.models import User
from game.models import Game
from channels.layers import get_channel_layer
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from enum import Enum
from icecream import ic
import sys

# Define constants
    # Screen
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 400
    # Paddle
PADDLE_WIDTH = 20 # could be pair (2k)
PADDLE_HEIGHT = 100 # could be pair (2k)
PADDLE_SPEED = 10
    # Ball
BALL_RADIUS = 10
FPS = 60

class PaddlePlayer(Enum):
    PLAYER_1_PADDLE = 1
    PLAYER_2_PADDLE = 2

class Paddle:
    def __init__(self, player: PaddlePlayer):
        self.paddlePlayer = player
        self.y = SCREEN_HEIGHT // 2
        if player == PaddlePlayer.PLAYER_1_PADDLE:
            self.x = 0  # paddle 1 is on the left
        else:
            self.x = SCREEN_WIDTH - PADDLE_WIDTH  # paddle 2 is on the right
        self.speed = PADDLE_SPEED
        self.width = PADDLE_WIDTH
        self.height = PADDLE_HEIGHT

    def move(self, key: str):
        direction = None
        if self.paddlePlayer == PaddlePlayer.PLAYER_1_PADDLE:
            if key == 'ArrowUp':
                direction = -1
            elif key == 'ArrowDown':
                direction = 1
        else:
            if key == 'ArrowUp':
                direction = -1
            elif key == 'ArrowDown':
                direction = 1

        if direction is not None:
            self.y += direction * self.speed
            # Ensure the paddle stays within the screen bounds
            self.y = max(self.height // 2, min(self.y, SCREEN_HEIGHT - self.height // 2))

class Ball:
    def __init__(self):
        self.x = SCREEN_WIDTH // 2
        self.y = SCREEN_HEIGHT // 2
        self.speed_x = 5
        self.speed_y = 2
    
    def get(self):
        return {
            'x': self.x,
            'y': self.y,
        }
    
    def move(self):
        self.x += self.speed_x
        self.y += self.speed_y
        if self.y - BALL_RADIUS <= 0 or self.y + BALL_RADIUS >= SCREEN_HEIGHT:
            self.speed_y = -self.speed_y
        if self.x - BALL_RADIUS <= 0 or self.x + BALL_RADIUS >= SCREEN_WIDTH:
            self.speed_x = -self.speed_x


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
        self.ball = Ball()
        self.player1: User = None
        self.player2: User = None

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
    
    def check_collision(self):
        y = self.ball.y
        r = BALL_RADIUS
        

    def update(self):
        self.ball.move()
        self.check_collision()


    def get_stats(self):
        stats = {
            'paddle1': self.paddle1.y,
            'paddle2': self.paddle2.y,
            'ball': self.ball.get()
        }
        return stats

    def get_init(self):
        '''
        return the initial state of the game.
        '''
        paddles = {
            'paddle1': self.paddle1.y,
            'paddle2': self.paddle2.y,
            'width': self.paddle1.width,
            'height': self.paddle1.height
        }
        game = {
            'width': self.width,
            'height': self.height
        }
        ball = self.ball.get()
        return {
            'paddles': paddles,
            'game': game,
            'ball': ball
        }
        
    def move_player(self, player_id, key):
        if player_id == self.player1.id:
            self.paddle1.move(key)
        elif player_id == self.player2.id:
            self.paddle2.move(key)

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

    def update(self, room_name):
        self.games[room_name].update()
    
    def move_player(self, room_name: str, player_id: int, key: str):
        return self.games[room_name].move_player(player_id, key)