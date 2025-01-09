import json, sys, asyncio, time
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from game.backend.tictac_game import TicTac
from game.models import Game1
from game.serializers import TicTacTeoSerializer
import math

class TicTacConsumer(AsyncWebsocketConsumer):
    games = {}
    turn_check_tasks = {}

    def __init__(self):
        super().__init__()
        self.game = None
        self.tictac = None
        self.groups = []
        self.user_channels = {}

    async def   connect(self):
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.player = self.scope['user']
        self.room_name = f'tictac_{self.game_id}'
        self.user_channels[self.player.id] = self.channel_name
            
        await self.channel_layer.group_add(self.room_name, self.channel_name)

        if not self.game_id in self.games:
            current_game = await self.get_game()
            self.games[self.game_id] = current_game

        self.game = self.games[self.game_id]

        if self.game["player1"] == self.game["player2"]:
            await self.close(code=4002)
            return
        
        self.tictac = TicTac(self.game_id, self.game["player1"], self.game["player2"])

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

        self.tictac.turn_start_time()
        if self.game_id not in self.turn_check_tasks:
            self.turn_check_tasks[self.game_id] = asyncio.create_task(self.check_turn_timing())

    async def disconnect(self, close_code):
        if self.game_id in self.turn_check_tasks:
            self.turn_check_tasks[self.game_id].cancel()
            del self.turn_check_tasks[self.game_id]
        current_player = self.tictac.player2 if self.tictac.player1["id"] == self.player.id else self.tictac.player1
        event = {
            'type': 'broad_cast',
            'data': {
                        'winner': current_player,
                        'board': self.tictac.get_board(),
                    },
                    'status': 203
            }
         
        await self.channel_layer.group_send(self.room_name, event)

        self.tictac.remove_game(game_id=self.game_id)
        if self.game_id in self.games:
            del self.games[self.game_id]
        if self.player.id in self.user_channels:
            del self.user_channels[self.player.id]

        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def receive(self, text_data=None):
        data = json.loads(text_data)
        if data["event"] == "action":
            status = self.tictac.play_turn(row=data.get('y'), col=data.get('x'), sender=self.player.id)
            if "error" in status:
                event = {
                    'type': 'send_to_user',
                    'data': {
                        'error': status['error'],
                        'user': self.tictac.get_current_turn(),
                        'board': self.tictac.get_board(),

                    },
                    'status': 400
                }
                await self.send_to_user(self.player.id, event=event)
            elif "winner" in status:
                if self.game_id in self.turn_check_tasks:
                    try:
                        self.turn_check_tasks[self.game_id].cancel()
                        del self.turn_check_tasks[self.game_id]
                    except Exception as e:
                        error =  f"Error cancelling turn check task for game {self.game_id}: {e}"
                event = {
                    'type': 'broad_cast',
                    'data': {
                        'winner': status["winner"],
                        'board': self.tictac.get_board(),
                    },
                    'status': 203
                }
                await self.channel_layer.group_send(self.room_name, event)
            elif "turn" in status:
                if self.game_id in self.turn_check_tasks:
                    try:
                        self.turn_check_tasks[self.game_id].cancel()
                        del self.turn_check_tasks[self.game_id]
                    except Exception as e:
                        error = f"Error cancelling turn check task for game {self.game_id}: {e}"
                event = {
                    'type': 'broad_cast',
                    'data': {
                        'user': self.tictac.get_current_turn(),
                        'board': self.tictac.get_board(),
                    },
                    'status': 202
                }
                await self.channel_layer.group_send(self.room_name, event)
                self.tictac.turn_start_time()
                self.turn_check_tasks[self.game_id] = asyncio.create_task(self.check_turn_timing())
        

    @database_sync_to_async
    def get_game(self):
        game = Game1.objects.get(id=self.game_id)
        serializer = TicTacTeoSerializer(game)
        return serializer.data

    async def broad_cast(self, event):
        await self.send(text_data=json.dumps(event))
    
    async def  send_to_user(self, user_id, event):
        user_channel_name = self.user_channels.get(user_id)
        if user_channel_name:
            await self.channel_layer.send(user_channel_name, {
                'type': 'user.message',
                'event': event
            })
    
    async def  user_message(self, event):
        await self.send(text_data=json.dumps(event['event']))

    async def check_turn_timing(self):
        start_time = self.tictac.get_start_time()
        time_limit = self.tictac.get_time_limit()
        current_turn = self.tictac.get_current_turn()
        player1 = self.tictac.get_player1()
        player2 = self.tictac.get_player2()
        while True:
            await asyncio.sleep(1)
            current_time = time.time()
            if current_time - start_time > time_limit:
                self.tictac.set_winner(player=player2 if current_turn == player1 else player1)
                event = {
                    'type': 'broad_cast',
                    'data': {
                        'winner': self.tictac.get_winner(),
                        'board': self.tictac.get_board(),
                    },
                    'status': 203
                }
                await self.channel_layer.group_send(self.room_name, event)
                break
            await self.channel_layer.group_send(self.room_name, {
                 'type': 'broad_cast',
                    'data': {
                        'time' : math.floor(time_limit - (current_time - start_time)) 
                    },
                    'status': 204
            })
        

