import math
import json
from tournment.utils.utils import debug
import random

class Game:
    match = None
    width = 600
    height = 400
    ball = 25
    paddle = 40
    ball_x = 0
    ball_y = 0
    paddle_ay = 0
    paddle_by = 0
    lastFrameTime = None
    angl = float(0.6 * (2 * math.pi))
    val = 400.0
    direction_x = math.cos(angl)
    direction_y = math.sin(angl)
    players = None
    end = False
    winner = None
    mx = None


    def reset(self):
        self.ball_x = (self.width / 2) - (self.ball / 2)
        self.ball_y = (self.height / 2) - (self.ball / 2)
        self.paddle_ay = (self.height / 2) - (self.paddle / 2)
        self.paddle_by = (self.height / 2) - (self.paddle / 2)
        self.val = 100.0

    
    def __init__(self, match) -> None:
        self.mx = random.randint(2, 6)
        self.match = match
        self.players = {"player1" : {"score": 0}, "player2" : {"score": 0}}
        self.players["player1"] = {**self.players["player1"], "user" : self.match['player_1']}
        self.players["player2"] = {**self.players["player2"], "user" : self.match['player_2']}
        self.reset()
        

    def __str__(self) -> str:
        return json.dumps(self.__dict__())
    
    def __dict__(self) -> dict:
        return {
            "bx":self.ball_x,
            "by":self.ball_y,
            "pay":self.paddle_ay,
            "pby":self.paddle_by,
            "players" : self.players,
            "ended": self.end,
            "winner" : self.winner
        }


    def update(self, dt):
        self.ball_x += (self.direction_x * self.val * dt)
        self.ball_y += (self.direction_y * self.val * dt)
        if (self.ball_y - 15) <= 0 or (self.ball_y + 15) >= self.height:
            self.direction_y *= -1
        # if (self.ball_y - 10) <= 0 and self.ball_x >= self.paddle_ax and self.ball_x <= (self.paddle_ax + self.paddle):
        #     self.direction_y *= -1
        # if (self.ball_y + 10) >= self.height and self.ball_x >= self.paddle_bx and self.ball_x <= (self.paddle_bx + self.paddle):
        #     self.direction_y *= -1
        elif self.ball_x <= 0 :
            self.players["player2"]["score"] += 1
            self.reset()
        elif self.ball_x >= self.width:
            self.players["player1"]["score"] += 1
            self.reset()
        if self.players["player1"]["score"] == self.mx:
            self.end = True
            self.winner = self.players["player1"]["user"]["id"]
        elif self.players["player2"]["score"] == self.mx:
            self.end = True
            self.winner = self.players["player2"]["user"]["id"]
        self.val += 0.8


    def update_paddles(self, action):
        if action == "p1_left" and self.paddle_ay > 0:
            self.paddle_ay -= 20
        elif action == "p1_right" and (self.paddle_ay + 40) < 400:
            self.paddle_ay += 20
        elif action == "p2_left" and self.paddle_by > 0:
            self.paddle_by -= 20
        elif action == "p2_right" and (self.paddle_by + 40) < 400:
            self.paddle_by += 20