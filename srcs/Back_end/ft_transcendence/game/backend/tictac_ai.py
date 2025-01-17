import math
import random
import time
from copy import deepcopy
from .tictac_game import TicTac

def get_ai_move(board):
    best_score = float('-inf')
    best_move = None
    
    for row in range(3):
        for col in range(3):
            if board[row][col] == '':
                board[row][col] = 'O'
                score = minimax(board, 0, False)
                board[row][col] = ''
                if score > best_score:
                    best_score = score
                    best_move = {'row': row, 'col': col}
    
    return best_move

def minimax(board, depth, is_maximizing):
    result = check_winner(board)
    if result is not None:
        return {
            'O': 1, 
            'X': -1,
            'tie': 0
        }[result]
    
    if is_maximizing:
        best_score = float('-inf')
        for row in range(3):
            for col in range(3):
                if board[row][col] == '':
                    board[row][col] = 'O'
                    score = minimax(board, depth + 1, False)
                    board[row][col] = ''
                    best_score = max(score, best_score)
        return best_score
    else:
        best_score = float('inf')
        for row in range(3):
            for col in range(3):
                if board[row][col] == '':
                    board[row][col] = 'X'
                    score = minimax(board, depth + 1, True)
                    board[row][col] = ''
                    best_score = min(score, best_score)
        return best_score

def check_winner(board):
    winning_combinations = [
        [[0,0], [0,1], [0,2]],
        [[1,0], [1,1], [1,2]],
        [[2,0], [2,1], [2,2]],
        [[0,0], [1,0], [2,0]],
        [[0,1], [1,1], [2,1]],
        [[0,2], [1,2], [2,2]],
        [[0,0], [1,1], [2,2]],
        [[0,2], [1,1], [2,0]]
    ]
    
    for line in winning_combinations:
        values = [board[r][c] for r, c in line]
        if values.count('X') == 3:
            return 'X'
        if values.count('O') == 3:
            return 'O'

    if all(board[i][j] != '' for i in range(3) for j in range(3)):
        return 'tie'
    
    return None