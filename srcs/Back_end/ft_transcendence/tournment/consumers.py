from channels.generic.websocket import AsyncWebsocketConsumer
import sys, asyncio
from .models import Tournment
from  asgiref.sync import sync_to_async
from .serializers import TournmentSerializer, PlayerSerializer
from .test import Builder, Player
import json

from channels.db import database_sync_to_async 

class TournmentConsumer(AsyncWebsocketConsumer):
    
    tournments = {}
    def __init__(self):
        super().__init__()
        self.user = None
        self.tournment = None
        self.builder = None
        self.data = None

    
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
        try:
            self.tournment = Tournment.objects.get(id=id)
            tr_serializer = TournmentSerializer(self.tournment)
            return tr_serializer.data
        except :
            pass

    def add_user_to_trournment(self):
        self.user = self.scope['user']
        if self.user:
            current = self.tournments.get(self.data['id'], None)
            print(current)
            sys.stdout.flush()
            if current:
                current['players'][self.user.id] = self.user
                print(current)
                sys.stdout.flush()
            

    async def connect(self):
        await self.accept()
        tournemnt_id = self.scope['url_route']['kwargs']['id']
        self.data = await sync_to_async(self.get_tournemnt_data)(tournemnt_id)

        if not self.tournments.get(tournemnt_id, None) and self.data['mode'] != 'local':
            self.tournments[tournemnt_id] = {"data" : self.data, "players" : {}}

        if self.data['mode'] == 'local':
            self.builder = Builder(self.data['players'])
            await self.play_tournment_local_mode(self.builder.levels)

        elif self.data['mode'] == 'remote':
            self.add_user_to_trournment()
            # print("remote")
            # sys.stdout.flush()
            # if self.data['players'] == self.data['max_players'] - 1:
            #     pass


    async def send_data(self, event):
        json_data = json.dumps({"response" : event["data"]})
        await self.send(text_data=json_data)

