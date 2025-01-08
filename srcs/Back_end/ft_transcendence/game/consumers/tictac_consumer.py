import json
import sys
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from game.backend.tictac_game import TicTac
from game.models import Game1
from game.serializers import TicTacTeoSerializer


class TicTacConsumer(AsyncWebsocketConsumer):
    games = {}

    def __init__(self):
        super().__init__()
        self.game = None
        self.tictac = None
        self.groups = []

    async def   connect(self):
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.player = self.scope['user']
        self.room_name = f'tictac_{self.game_id}'
            

        await self.channel_layer.group_add(self.room_name, self.channel_name)

        if not self.game_id in self.games:
            current_game = await self.get_game()
            self.games[self.game_id] = current_game
        self.game = self.games[self.game_id]
        if self.game["player1"] == self.game["player2"]:
            await self.close(code=4002)
            return
        self.tictac = TicTac(self.game["player1"], self.game["player2"])
        event = {
            'type': 'broad_cast',
            'data': {
                'players' : [self.game["player1"], self.game["player2"]],
                'user' : self.tictac.player1,
                'board': self.tictac.get_board()
            }, 
            'status': 201
        }
        await self.channel_layer.group_send(self.room_name, event)
        await self.accept()

    async def disconnect(self, close_code):
        current_player = self.tictac.player2 if self.tictac.player1["id"] == self.player.id else self.tictac.player1
        event = {
            'type': 'broad_cast',
            'data': {
                        'user': current_player,
                        'board': self.tictac.get_board(),
                    },
                    'status': 203
            }
        await self.channel_layer.group_send(self.room_name, event)

        if self.game_id in self.games:
            del self.games[self.game_id]

        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def receive(self, text_data=None):
        data = json.loads(text_data)
        if data["event"] == "action":
            status = self.tictac.play_turn(row=data.get('y'), col=data.get('x'), sender=self.player.id)
            if "error" in status:
                event = {
                    'type': 'broad_cast',
                    'data': {
                        'error': status['error'],
                        'user': self.tictac.get_current_turn(),
                        'board': self.tictac.get_board(),

                    },
                    'status': 400
                }
            elif "winner" in status:
                event = {
                    'type': 'broad_cast',
                    'data': {
                        'winner': status["winner"],
                        'board': self.tictac.get_board()
                    },
                    'status': 203
                }
            elif "turn" in status:
                event = {
                    'type': 'broad_cast',
                    'data': {
                        'user': self.tictac.get_current_turn(),
                        'board': self.tictac.get_board()
                    },
                    'status': 202
                }
        await self.channel_layer.group_send(self.room_name, event)

    @database_sync_to_async
    def get_game(self):
        game = Game1.objects.get(id=self.game_id)
        serializer = TicTacTeoSerializer(game)
        return serializer.data

    async def broad_cast(self, event):
        await self.send(text_data=json.dumps(event))
        

