import sys, time

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
            self.current_turn = player1
            self.start_time = None
            self.turn_time_limit = 12
    
    def make_move(self, row, colom, player):
        try:
            if self.board[row][colom] == '':
                self.board[row][colom] = 'X' if self.current_turn == self.player1 else 'O'
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
        for row in self.board:
            for cell in row:
                if cell == '':
                    return False
        return True
    
    def play_turn(self, row, col, sender):
        if self.winner:
            return {"winner": self.winner}
        player = self.current_turn
        if player["id"] == sender:
            try:
                self.make_move(row, col, player)
                self.current_turn = self.player2 if self.current_turn == self.player1 else self.player1
            except Exception as e:
                return {'error': str(e)}
            if self.check_complete(sign='X' if player == self.player1 else 'O', player=player):
                return {'winner': player}
            if self.is_board_full():
                return {'winner': None}
            else:
                return {'turn': self.get_current_turn}
        return {'error': "not your turn"}

    def get_board(self):
        return self.board
    
    def get_current_turn(self):
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