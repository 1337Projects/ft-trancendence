import sys


class TicTac:
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
    
    def __init__(self, player1, player2, user) -> None:
        self.player1 = player1
        self.player2 = player2
        self.board = [['' for _ in range(3)] for _ in range(3)]
        self.current_turn = player1
    
    def make_move(self, row, colom, player):
        try:
            if self.board[row][colom] == '':
                self.board[row][colom] = 'X' if self.current_turn == self.player1 else 'O'
                self.current_turn = self.player2 if self.current_turn == self.player1 else self.player1
            else:
                raise NameError("already taken")
        except Exception as e:
            print(e)

    def check_complete(self, player):
        for line in self.senario_of_success:
            sum = 0
            for item in line:
                r, c = item
                if self.board[r][c] == player:
                    sum += 1
                if sum == 3:
                    return True
        return False
    
    def play_turn(self, row, col, sender):
        player = self.current_turn
        try:
            self.make_move(row, col, player)
        except Exception as e:
            return {'error': str(e)}
        if self.check_complete('X' if player == self.player1 else 'O'):
            return {'winner': player}
        else:
            return {'turn': self.get_current_turn}
  
    def get_board(self):
        return self.board
    
    def get_current_turn(self):
        return self.current_turn