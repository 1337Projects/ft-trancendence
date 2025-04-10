import math
import random
import time
from .tictac_game import TicTac

def get_ai_move(board, ai_symbol):
    human_symbol = 'X' if ai_symbol == 'O' else 'O'
    best_score = float('-inf')
    best_move = None
    
    for row in range(3):
        for col in range(3):
            if board[row][col] == '':
                if is_win_move(board, row, col, ai_symbol):
                    return {'row': row, 'col': col}
                board[row][col] = ai_symbol
                score = minimax(board, 0, False, ai_symbol, human_symbol)
                board[row][col] = ''
                if score > best_score:
                    best_score = score
                    best_move = {'row': row, 'col': col}
    
    return best_move

def minimax(board, depth, is_maximizing, ai_symbol, human_symbol):
    result = check_winner(board)
    if result is not None:
        if result == ai_symbol:
            return 10 - depth
        elif result == human_symbol:
            return depth - 10
        return 0
    
    if is_maximizing:
        best_score = float('-inf')
        for row in range(3):
            for col in range(3):
                if board[row][col] == '':
                    board[row][col] = ai_symbol
                    score = minimax(board, depth + 1, False, ai_symbol, human_symbol)
                    board[row][col] = ''
                    best_score = max(score, best_score)
        return best_score
    else:
        best_score = float('inf')
        for row in range(3):
            for col in range(3):
                if board[row][col] == '':
                    board[row][col] = human_symbol
                    score = minimax(board, depth + 1, True, ai_symbol, human_symbol)     
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
        symbol = values[0]
        if symbol != '' and all(cell == symbol for cell in values):
            return symbol

    if all(board[i][j] != '' for i in range(3) for j in range(3)):
        return 'tie'
    
    return None

def is_win_move(board, row, col, ai_symbol):
    board[row][col] = ai_symbol
    is_winning = check_winner(board) == ai_symbol
    board[row][col] = ''
    return is_winning

def get_first_move(board):
    best_move = [[0,0],[0,2],[1,1],[2,2],[2,0]]
    random.shuffle(best_move)
    for move in best_move:
        if board[move[0]][move[1]] == '':
            return {'row' : move[0], 'col': move[1]}
        
    