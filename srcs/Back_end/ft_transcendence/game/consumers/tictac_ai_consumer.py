import json, sys, asyncio, time
import os
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from game.backend.tictac_game import TicTac
from game.models import Game1
from game.serializers import TicTacTeoSerializer
import math,uuid
from account.serializer import UserWithProfileSerializer
from game.backend.tictac_ai import get_ai_move, get_first_move
from django.contrib.auth.models import AnonymousUser

class TicTacWithAiConsumer(AsyncWebsocketConsumer):
    turn_check_tasks = {}

    def __init__(self):
        super().__init__()
        self.game_id = str(uuid.uuid4().int)
        self.tictac = None
        self.groups = []
        self.user_channels = {}
        self.task_ai = None
        self.ai_symbol = None

    async def connect(self):
        try:
            if isinstance(self.scope['user'], AnonymousUser):
                await self.close()
                return
            
            await self.accept()
            self.player = await self.get_user()
            self.ai = {
                'id' : str(uuid.uuid4().int),
                'username': 'AI',
                'profile': {
                    'avatar': f"{os.environ.get('API_URL')}media/ai.avif"    
                }
            }
            self.room_name = f'tictac_ai_{self.game_id}'
            self.user_channels[self.player["id"]] = self.channel_name

            await self.channel_layer.group_add(self.room_name, self.channel_name)

            self.tictac = TicTac(self.game_id, self.player, self.ai)
            first_turn = self.tictac.get_current_turn()  
            self.ai_symbol = 'X' if first_turn == self.ai else 'O'
            player_symbol= 'O' if self.ai_symbol == 'X' else 'X'
            event = {
                'type': 'broad_cast',
                'data': {
                    'players' : [{"user" : self.player, "char" : player_symbol}, {"user" : self.ai, "char" : self.ai_symbol}],
                    'user' : first_turn,
                    'board': self.tictac.get_board()
                }, 
                'status': 201
            }
            await self.channel_layer.group_send(self.room_name, event)
            

            self.tictac.turn_start_time()
            if self.game_id not in self.turn_check_tasks:
                self.turn_check_tasks[self.game_id] = asyncio.create_task(self.check_turn_timing())
            if self.tictac.get_current_turn() == self.ai:
                self.task_ai = asyncio.create_task(self.turn_ai())
        except Exception as e:
            self.send_error(str(e))

    async def disconnect(self, close_code):
        if hasattr(self, 'game_id') and self.game_id in self.turn_check_tasks:
            self.turn_check_tasks[self.game_id].cancel()
            del self.turn_check_tasks[self.game_id]

        if hasattr(self, 'task_ai') and self.task_ai:
            self.task_ai.cancel()
            self.task_ai = None

        if hasattr(self, 'tictac') and self.tictac:
            self.tictac.remove_game(game_id=self.game_id)
        if hasattr(self, 'player') and self.player.get('id') in self.user_channels:
            del self.user_channels[self.player["id"]]

        if hasattr(self, 'room_name') and hasattr(self, 'channel_name'):
            await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def receive(self, text_data=None):
        try:
            data = json.loads(text_data)
            if data["event"] == "action":
                status = self.tictac.play_turn(row=data.get('y'), col=data.get('x'), sender=self.player["id"])
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
                    await self.send_to_user(self.player['id'], event=event)
                elif "winner" in status: 
                    if self.game_id in self.turn_check_tasks:
                        try:
                            self.turn_check_tasks[self.game_id].cancel()
                            del self.turn_check_tasks[self.game_id]
                            if self.turn_ai:
                                self.task_ai.cancel()
                                self.turn_ai = None
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
                    if self.tictac.get_current_turn() == self.ai:
                        self.task_ai = asyncio.create_task(self.turn_ai())
        except Exception as e:
            self.send_error(str(e))

    async def turn_ai(self):
        await asyncio.sleep(5)
        board = self.tictac.get_board()
        move = await self.ai_move(board)
      
        sys.stdout.flush()
        status = self.tictac.play_turn(row=move['row'], col=move['col'], sender=self.ai['id'])
        if "winner" in status:
            sys.stdout.flush()
            try:
                self.turn_check_tasks[self.game_id].cancel()
                del self.turn_check_tasks[self.game_id]
            except Exception as e:
                error = f"Error cancelling turn check task for game {self.game_id}: {e}"
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
            if self.game_id not in self.turn_check_tasks:
                self.turn_check_tasks[self.game_id] = asyncio.create_task(self.check_turn_timing())

    async def   ai_move(self, board):
        if self.tictac.get_moves() == 1 or self.tictac.get_moves() == 0:
            move = get_first_move(board=board)
        else:
            move = get_ai_move(board, self.ai_symbol)
        return move

    @database_sync_to_async
    def get_user(self):
        serializer = UserWithProfileSerializer(self.scope['user'])
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
    async def send_error(self, error):
        res = {
            "status" : 400,
            "error" : error
        }
        await self.send(text_data=json.dumps({"response" : res}))