from channels.generic.websocket import AsyncWebsocketConsumer
import sys, asyncio
from .models import Tournment
from  asgiref.sync import sync_to_async
from .serializers import TournmentSerializer
from .test import Builder, Player
import json

class TournmentConsumer(AsyncWebsocketConsumer):
    
    builder = None
    data = None
    
    async def start_match(self, match):
        match.val.status = 'started'
        await asyncio.sleep(2)
        match.val.status = 'ended'
        match.val = Player(match.left.val.data)


    async def play_tournment_local_mode(self, level):
        if level == 0:
            return
        await self.play_tournment_local_mode(level - 1)
        match = self.builder.get_match_at_given_level(level, self.builder.levels, self.builder.tree)
        while match != None:
            self.builder.make_rounds()
            tr_data = {
                "data" : self.data,
                "rounds" :  self.builder.get_rounds(),
                "current_round" : level,
                "status" : 210
            }
            await self.send(text_data=json.dumps({"response" : tr_data}))
            await self.start_match(match)
            match = self.builder.get_match_at_given_level(level, self.builder.levels, self.builder.tree)


    def get_tournemnt_data(self, id):
        tr = Tournment.objects.get(id=id)
        tr_serializer = TournmentSerializer(tr)
        return tr_serializer.data


    async def connect(self):
        await self.accept()
        tournemnt_id = self.scope['url_route']['kwargs']['id']
        self.data = await sync_to_async(self.get_tournemnt_data)(tournemnt_id)
        self.builder = Builder(self.data['players'])
        # await self.send(text_data=json.dumps({"response" : {
        #     "data" : self.data,
        #     "rounds" :  self.builder.get_rounds(),
        #     "current_round" : self.builder.levels,
        #     "status" : 210
        # }}))
        if self.data['mode'] == 'local':
            await self.play_tournment_local_mode(self.builder.levels)


    async def send_data(self, event):
        json_data = json.dumps({"response" : event["data"]})
        await self.send(text_data=json_data)

