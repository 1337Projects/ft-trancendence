from login.models import User
from game.models import Game
from enum import Enum
import sys
from asgiref.sync import sync_to_async

# Define constants
    # Screen
SCREEN_WIDTH = 550
SCREEN_HEIGHT = 300
    # Paddle
PADDLE_WIDTH = 10 # could be pair (2k)
PADDLE_HEIGHT = 60 # could be pair (2k)
PADDLE_SPEED = 20
    # Ball
BALL_RADIUS = 10
BALL_SPEEDX = 5
BALL_SPEEDY = 1
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

    def update_speed(self, ball):
        ball_y = ball.y
        middle = self.height // 2
        if ball_y < self.y - middle // 2 or ball_y > self.y + middle // 2:
            ball.speed_y = ball.speed_y if abs(ball.speed_y) == 2 else ball.speed_y * 2
        else:
            ball.speed_y = ball.speed_y if abs(ball.speed_y) == 1 else ball.speed_y // 2
        # if ball_y < self.y - middle // 2:
        #     ball.speed_y = -3
        # elif ball_y > self.y + middle // 2:
        #     ball.speed_y = 3
        # else:
        #     if ball_y < self.y:
        #         ball.speed_y = -1
        #     else:
        #         ball.speed_y = 1

            
        
    def check_collision(self, ball) -> bool:
        '''
        Check if the ball collides with the paddle or a goal is scored.
        return:
        True if goal is scored and false otherwise.
        '''
        x = ball.x
        y = ball.y
        r = BALL_RADIUS
        if self.paddlePlayer == PaddlePlayer.PLAYER_1_PADDLE:
            if x - r <= self.x + self.width:
                if y  < self.y - (self.height // 2 + 10) or y > self.y + (self.height // 2 + 10):
                    return True
                ball.speed_x = -ball.speed_x
                self.update_speed(ball)
                ball.x = max(self.x + self.width, ball.x)
        else:
            if x + r >= self.x:
                if y - r < self.y - (self.height // 2 + 20) or y + r > self.y + (self.height // 2 + 20):
                    return True
                ball.speed_x = -ball.speed_x
                self.update_speed(ball)
                ball.x = min(self.x - r, ball.x)

        return False
    
    def reset(self):
        self.y = SCREEN_HEIGHT // 2

class Ball:
    def __init__(self):
        self.x = SCREEN_WIDTH // 2
        self.y = SCREEN_HEIGHT // 2
        self.speed_x = BALL_SPEEDX
        self.speed_y = BALL_SPEEDY
    
    def increse_speed(self):
        sign = 1 if self.speed_x > 0 else -1
        self.speed_x += sign
        sys.stdout.flush()
    
    def get(self):
        return {
            'x': self.x,
            'y': self.y,
        }
    
    def move(self):
        self.x += self.speed_x
        self.y += self.speed_y
        if self.y - BALL_RADIUS <= 0 or self.y + BALL_RADIUS >= SCREEN_HEIGHT: # hit the top of bottom
            self.speed_y = -self.speed_y
        # if self.x - BALL_RADIUS <= 0 or self.x + BALL_RADIUS >= SCREEN_WIDTH:
        #     self.speed_x = -self.speed_x

    def reset(self):
        self.x = SCREEN_WIDTH // 2
        self.y = SCREEN_HEIGHT // 2
        x_sign = -1 if self.speed_x < 0 else 1
        y_sign = -1 if self.speed_y < 0 else 1
        self.speed_x = BALL_SPEEDX * x_sign * -1
        self.speed_y = BALL_SPEEDY * y_sign * -1
class PongGame:
    def __init__(self, game: Game, room_name):
        self.status = 'waiting'
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

    def increse_ball_speed(self):
        self.ball.increse_speed()

    def reset(self):
        self.ball.reset()
        self.paddle1.reset()
        self.paddle2.reset()

    def update(self):    
        self.ball.move()
        if self.ball.x - BALL_RADIUS <= self.paddle1.width:
            if self.paddle1.check_collision(self.ball): # check if goal is scored on player 1
                # update score
                self.score2 += 1
                self.reset()
                return {
                    'score1': self.score1,
                    'score2': self.score2
                }
        if self.ball.x + BALL_RADIUS >= self.paddle2.x:
            if self.paddle2.check_collision(self.ball):
                self.score1 += 1
                self.reset()
                return {
                    'score1': self.score1,
                    'score2': self.score2
                }
        return None
            

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
