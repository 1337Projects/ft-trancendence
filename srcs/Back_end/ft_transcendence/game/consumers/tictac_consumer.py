import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from backend.tictac_game import tictak
from game.models import Game1


class tictacConsumer(AsyncWebsocketConsumer):
    games = {}

    def __ini__(self):
        self.game = None
        self.tictak = None

    async def   connect(self):
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.player = self.scope['user']
        self.room_name = f'game_{self.game_id}'

        self.channel_layer.group_add(self.room_name, self.channel_name)

        if not self.game_id in self.games:
            self.games[self.game_id] = await database_sync_to_async(Game1.objects.get)(id=self.game_id)#try catch
        else:
            self.game = self.games[self.game_id]
            self.tictak = tictak(self.game.player1, self.game.player2)
            
            event = {
                'type': 'broad_cast',
                'data': {
                    'user' : self.game.player1,
                    'board': self.tictak.get_board()
                },
                'status': 201
            }
            await self.channel_layer.goup_send(event)


    async def receive(self):
        pass

    async def broad_cast(self, event):
        await self.send(text_data=json.dumps(event))
        

