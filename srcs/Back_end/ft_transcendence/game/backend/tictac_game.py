import sys, time, random
from game.models import Game1
from login.models import User
from account.models import Profile, ExperienceLog
from django.db import models
import copy

class TicTac:
    _instances = {}
    senario_of_success = [
        [[0,0], [0,1], [0,2]],
        [[1,0], [1,1], [1,2]],
        [[2,0], [2,1], [2,2]],
        [[0,0], [1,0], [2,0]],
        [[0,1], [1,1], [2,1]],
        [[0,2], [1,2], [2,2]],
        [[0,0], [1,1], [2,2]],
        [[0,2], [1,1], [2,0]]
    ]
    
    def __new__(cls, game_id, player1, player2):
        if game_id not in cls._instances:
            cls._instances[game_id] = super(TicTac, cls).__new__(cls)
        return cls._instances[game_id]

    def __init__(self, game_id, player1, player2) -> None:
        if not hasattr(self, 'initialized'):
            self.player1 = player1
            self.player2 = player2
            self.game_id = game_id
            self.board = [['' for _ in range(3)] for _ in range(3)]
            self.initialized = True
            self.winner = None
            self.current_turn = None
            self.start_time = None
            self.turn_time_limit = 12
            self.match_stored = False
            self.moves = 0
    
    def make_move(self, row, colom, player):
        try:
            if self.board[row][colom] == '':
                self.board[row][colom] = 'X' if self.current_turn == self.player1 else 'O'
                self.moves += 1
            else:
                raise NameError("already taken")
        except Exception as e:
            raise e

    def check_complete(self, sign, player):
        for line in self.senario_of_success:
            sum = 0
            for item in line:
                r, c = item
                if self.board[r][c] == sign:
                    sum += 1
                if sum == 3:
                    self.winner = player
                    return True
        return False
    
    def is_board_full(self):
        return True if self.moves == 9 else False
    
    def play_turn(self, row, col, sender):
        if self.winner:
            return {"winner": self.winner}
        player = self.current_turn
        if player["id"] == sender:
            try:
                self.make_move(row, col, player)
                self.current_turn = self.player2 if self.current_turn == self.player1 else self.player1
            except Exception as e:
                raise e
            if self.check_complete(sign='X' if player == self.player1 else 'O', player=player):
                self.set_winner(player=player)
                return {'winner': player}
            elif self.is_board_full():
                return {'winner': None}
            else:  
                return {'turn': self.get_current_turn}
        return {'error': "not your turn"}
    
    def store_match(self):
        if not self.match_stored:
            try:
                user1 = User.objects.get(id=self.player1["id"]) if isinstance(self.player1, dict) else self.player1
                user2 = User.objects.get(id=self.player2["id"]) if isinstance(self.player2, dict) else self.player2
                player1_profile = Profile.objects.get(user=user1)
                player2_profile = Profile.objects.get(user=user2)

                if self.winner == None:
                    self.store_game(winner=None)
                    player1_experience = 10
                    player2_experience = 10
                else:
                    self.store_game(winner=user1 if self.player1 == self.winner else user2)
                    player1_experience = 20 if self.player1 == self.winner else 10
                    player2_experience = 20 if self.player2 == self.winner else 10 

                self.store_experience_log(player1_profile, player2_profile, player1_experience, player2_experience)

                player1_total_experience, player2_total_experience = self.get_total_experience(player1=player1_profile, player2=player2_profile)

                player1_profile.level = player1_total_experience / 100
                player2_profile.level = player2_total_experience / 100        

                player1_profile.save()
                player2_profile.save()

                self.match_stored = True
            except Exception as err:
                raise err

    def store_experience_log(self, player1_profile, player2_profile, player1_experience, player2_experience):
        ExperienceLog.objects.create(profile=player1_profile, experience_gained=player1_experience)
        ExperienceLog.objects.create(profile=player2_profile, experience_gained=player2_experience)

    def store_game(self, winner):
        game = Game1.objects.get(id=self.game_id)
        game.winner = winner
        game.ended = True
        game.save()

    def get_total_experience(self, player1, player2):
        player1_total_experience = ExperienceLog.objects.filter(profile=player1).aggregate(total=models.Sum('experience_gained'))['total']
        player2_total_experience = ExperienceLog.objects.filter(profile=player2).aggregate(total=models.Sum('experience_gained'))['total']
        return player1_total_experience, player2_total_experience
    
    def get_current_turn(self):
        if self.current_turn is None:
            self.current_turn =  self.player1 if random.randint(0, 1) == 0 else self.player2
            self.player2 = self.player2 if self.current_turn == self.player1 else self.player1
            self.player1 = self.current_turn
        return self.current_turn
    
    def get_winner(self):
        return self.winner
    
    def set_winner(self, player):
        self.winner = player
      
    def remove_game(self, game_id):
        if game_id in self._instances:
            del self._instances[game_id]
    
    def turn_start_time(self):
        self.start_time = time.time()
    
    def get_start_time(self):
        return self.start_time

    def get_time_limit(self):
        return self.turn_time_limit
    
    def get_player1(self):
        return self.player1
    
    def get_player2(self):
        return self.player2
    
    def is_match_stored(self):
        return self.match_stored
    
    def get_board(self):
        return copy.deepcopy(self.board)
    
    def get_moves(self):
        return self.moves