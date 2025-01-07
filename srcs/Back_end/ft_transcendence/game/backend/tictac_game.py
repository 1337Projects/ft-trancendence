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
    
    def __init__(self, player1, player2) -> None:
        self.player1 = player1
        self.player2 = player2
        self.board = [['' for _ in range(3)] for _ in range(3)]
        self.current_turn = player1
    
    def makeMove(self, row, colom):
        try:
            if self.board[row][colom] == '':
                self.board[row][colom] = 'X' if self.current_turn == self.player1 else 'O'
                self.current_turn = self.player2 if self.current_turn == self.player1 else self.player1
            else:
                raise NameError("already taken")
        except Exception as e:
            self.debug(e)

    def checkComplete(self, player):
        for line in self.senario_of_success:
            sum = 0
            for item in line:
                r, c = item
                if self.board[r][c] == player:
                    sum += 1
                if sum == 3:
                    return True
        return False
    
    def get_board(self):
        return self.board



if __name__ == '__main__':
    pr = tictak('player1', 'player2')
    pr.makeMove(0, 0)

    print("make move")
    if pr.checkComplete('X'):
        print("game over palyer1")
    if pr.checkComplete('O'):
        print("game over palyer2")

    pr.makeMove(0, 2)
    print("make move")

    if pr.checkComplete('X'):
        print("game over palyer1")
    if pr.checkComplete('O'):
        print("game over palyer2")

    pr.makeMove(0, 1)
    print("make move")

    if pr.checkComplete('X'):
        print("game over palyer1")
    if pr.checkComplete('O'):
        print("game over palyer2")

    pr.makeMove(1, 1)
    print("make move")

    if pr.checkComplete('X'):
        print("game over palyer1")
    if pr.checkComplete('O'):
        print("game over palyer2")

    pr.makeMove(1, 2)
    # pr.debug(pr.board)
    print("make move")
    if pr.checkComplete('O'):
        print("game over palyer2")
    if pr.checkComplete('X'):
        print("game over palyer1")

    pr.makeMove(2, 0)
    # pr.debug(pr.board)
    print("make move")
    if pr.checkComplete('O'):
        print("game over palyer2")
    if pr.checkComplete('X'):
        print("game over palyer1")
    # pr.makeMove(0, 2, 'x')
    # pr.makeMove(1, 0, 'x')
    # pr.makeMove(1, 1, 'x')
    # pr.makeMove(1, 2, 'x')
    # pr.makeMove(2, 0, 'x')
    # pr.makeMove(2, 1, 'x')
    # pr.makeMove(2, 2, 'x')
    # pr.makeMove(2, 20, 'x')
 
    # pr.makeMove(0, 2, 'o')
    # pr.makeMove(0, 3, 'x')