from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
from .models import Tournment
from  asgiref.sync import sync_to_async
from .serializers import TournmentSerializer
from .test import Builder, Player
import json, copy
from account.serializer import UserWithProfileSerializer

from .utils import debug

class TournmentConsumer(AsyncWebsocketConsumer):
    
    tournments = {}
    def __init__(self):
        super().__init__()
        self.serialized_user = None
        self.builder = None
        self.tournment_id = None
        self.tournment_data = None
        self.task = None


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
                "data" : self.tournment_data,
                "rounds" :  self.builder.get_rounds(),
                "current_round" : level,
                "status" : 210
            }
            await self.send(text_data=json.dumps({"response" : tr_data}))
            await self.start_match(match)
            match = self.builder.get_match_at_given_level(level, self.builder.levels, self.builder.tree)
    

    async def play_tournment_remote_mode(self, lvl):
        if lvl == 0:
            return
        await self.play_tournment_remote_mode(lvl - 1)
        match = self.builder.get_match_at_given_level(lvl, self.builder.levels, self.builder.tree)
        while match is not None:
            self.builder.make_rounds()
            tr_data = {
                "data" : self.tournment_data,
                "rounds" :  self.builder.get_rounds(),
                "current_round" : lvl,
                "status" : 210
            }
            await self.start_match(match)
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type" : "send_data",
                    "data" : tr_data
                }
            )
            match = self.builder.get_match_at_given_level(lvl, self.builder.levels, self.builder.tree)



    def get_tournemnt_data(self, id):
        try:
            self.tournment = Tournment.objects.get(id=id)
            tr_serializer = TournmentSerializer(self.tournment)
            return tr_serializer.data
        except :
            pass


    async def add_user_to_trournment(self):
        current = self.tournments.get(self.tournment_id, None)
        if current:
            current['players'][self.serialized_user['id']] = self.serialized_user
            data = copy.deepcopy(current)
            data['players'] = self.formatePlayyers()
            await self.channel_layer.group_send(
                self.group_name, 
                {
                    "type": "send_data",
                    "data": {
                        "data" : data,
                        "status" : 100
                    }
                }
            )


    def serialize_user(self):
        try:
            user_serializer =  UserWithProfileSerializer(self.scope['user'])
            return user_serializer.data
        except :
            return None


    def formatePlayyers(self):
        players = []
        for player in self.tournments[self.tournment_id]['players'].values():
            players.append(player)
        return players
    

    async def connect(self):

        await self.accept()

        self.tournment_id = self.scope['url_route']['kwargs']['id']

        # serialize user && get tournament data
        self.serialized_user = await sync_to_async(self.serialize_user)()
        self.tournment_data = await sync_to_async(self.get_tournemnt_data)(self.tournment_id)

        self.group_name = f"tournment_{self.tournment_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)

        # add tournament to static var if not exist
        if not self.tournments.get(self.tournment_id, None) and self.tournment_data['mode'] != 'local':
            self.tournments[self.tournment_id] = {"data" : self.tournment_data, "players" : {}}

        # play local mode
        if self.tournment_data['mode'] == 'local':
            self.tournments[self.tournment_data['id']] = self.tournment_data
            debug(self.tournments)
            self.builder = Builder(self.tournment_data['players'])
            self.play_tournment_local_mode(self.builder.levels)

        # add user to tournament
        elif self.tournment_data['mode'] == 'remote':
            await self.add_user_to_trournment()


           
    async def receive(self, text_data=None):
        json_data = json.loads(text_data)
        if (json_data["event"] == 'start_tournament'):
            current = self.tournments.get(self.tournment_id, None)
            data = copy.deepcopy(current)
            data['players'] = self.formatePlayyers()
            self.builder = Builder(data['players'])
            self.task = asyncio.create_task(self.play_tournment_remote_mode(self.builder.levels))


    async def send_data(self, event):
        json_data = json.dumps({"response" : event["data"]})
        await self.send(text_data=json_data)


    async def disconnect(self, close_code):
        if self.task != None:
            self.task.cancel()
        if self.tournment_data['mode'] == 'remote':
            del self.tournments[str(self.tournment_id)]['players'][self.scope['user'].id]
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
            data = copy.deepcopy(self.tournments[self.tournment_id])
            data['players'] = self.formatePlayyers()
            await self.channel_layer.group_send(self.group_name, {"type": "send_data", "data": {"data" : data, "status" : 100}})
