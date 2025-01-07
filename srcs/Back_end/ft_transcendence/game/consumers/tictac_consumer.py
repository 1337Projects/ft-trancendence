import json
import sys
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from game.backend.tictac_game import TicTac
from game.models import Game1
from game.serializers import TicTacTeoSerializer


class TicTacConsumer(AsyncWebsocketConsumer):
    games = {}

    def __ini__(self):
        self.game = None
        self.tictak = None

    async def   connect(self):
        try:
            await self.accept()
            self.game_id = self.scope['url_route']['kwargs']['game_id']
            self.player = self.scope['user']
            self.room_name = f'game_{self.game_id}'

            await self.channel_layer.group_add(self.room_name, self.channel_name)

            if not self.game_id in self.games:
                current_game = await self.get_game()
                self.games[self.game_id] = current_game
            else:
                self.game = self.games[self.game_id]
                self.tictak = TicTac(self.game["player1"], self.game["player2"])
                event = {
                    'type': 'broad_cast',
                    'data': {
                        'players' : [self.game["player1"], self.game["player2"]],
                        'user' : self.tictak.player1,
                        'board': self.tictak.get_board()
                    }, 
                    'status': 201
                }
                await self.channel_layer.group_send(self.room_name, event)
               
                
        except Exception as e:
            print(e)
            sys.stdout.flush()




    async def receive(self, text_data=None):
        data = json.loads(text_data)
        print(data)
        sys.stdout.flush()

    @database_sync_to_async
    def get_game(self):
        game = Game1.objects.get(id=self.game_id)
        serializer = TicTacTeoSerializer(game)
        return serializer.data

    async def broad_cast(self, event):
        await self.send(text_data=json.dumps(event))
        

