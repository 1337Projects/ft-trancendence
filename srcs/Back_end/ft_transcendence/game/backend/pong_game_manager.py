from typing import Dict
from game.backend.pong_game_backend import PongGame
from game.models import Game
from login.models import User

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

    def get_stats(self, room_name):
        return self.games[room_name].get_stats()

    def get_game_status(self, room_name):
        if room_name not in self.games:
            return None
        return self.games[room_name].status
        
    def get_init(self, room_name):
        '''
        get the init stat of the game.
        '''
        game = self.games[room_name]
        game.status = 'start'
        return game.get_init()
    def update(self, room_name):
        return self.games[room_name].update()
    
    def move_player(self, room_name: str, player_id: int, key: str):
        return self.games[room_name].move_player(player_id, key)

    def game_is_starting(self, room_name):
        return self.games[room_name].status == 'start'
    
    def end_game(self, room_name):
        self.games[room_name].status = 'end'
    
    def increse_speed(self, room_name):
        self.games[room_name].increse_ball_speed()