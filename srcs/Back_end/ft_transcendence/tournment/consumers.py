from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
from .models import Tournment
from  asgiref.sync import sync_to_async, async_to_sync
from .serializers import TournmentSerializer, PlayerSerializer
from game_api.serializers import MatchSerializer
from .test import Builder, Player, Match
import json, copy
from account.serializer import UserWithProfileSerializer
import threading
from .utils import debug
from channels.db import database_sync_to_async
import logging
from login.models import User

logger = logging.getLogger('channels')

class MatchMakeingConsumer(AsyncWebsocketConsumer):

    tournaments = {}

    def __init__(self):
        super().__init__()
        self.tournment_id = None
        self.group_name = None
        self.serialized_user = None

    async def connect(self):
        await self.accept()
        self.tournment_id = self.scope['url_route']['kwargs']['id']
        self.group_name = f"tournament_{self.tournment_id}"

        self.serialized_user = await sync_to_async(self.serialize_user)()
        if not self.serialized_user:
            return

        await self.channel_layer.group_add( self.group_name, self.channel_name )

        if not self.tournaments.get(self.tournment_id, None):

            current_turnament = await sync_to_async(self.get_tournemnt_data)(self.tournment_id)

            if current_turnament:
                self.tournaments[self.tournment_id] = {"data" : current_turnament, "players" : {}}
            
        current_turnament = self.tournaments.get(self.tournment_id, None)
        if current_turnament:
            current_turnament['players'][self.serialized_user['id']] = self.serialized_user

            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type" : "send_data",
                    "data" : {
                        "data" : current_turnament,
                        "status" : 100
                    }
                }
            )

        if len(current_turnament['players']) == current_turnament['data']['max_players']:
            ret  = await sync_to_async(self.add_players_to_db)()
            

    async def send_data(self, event):
        await self.send(text_data= json.dumps({"response" : event["data"]}))


    async def disconnect(self, code):
        current_tournament = self.tournaments[self.tournment_id]
        try:
            del current_tournament['players'][self.scope['user'].id]
        except:
            pass

        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type" : "send_data",
                "data" : {
                    "status" : 100,
                    "data" : current_tournament
                }
            }
        )

    def add_players_to_db(self):
        try:
            current_tournament = self.tournaments[self.tournment_id]
            tournment = Tournment.objects.get(id=self.tournment_id)
            for player in current_tournament['players'].values():
                try:
                    current_player = User.objects.get(id=player['id'])
                except:
                    continue
                try:
                    tournment.players.add(current_player)
                except Exception as e:
                    continue
            return True
        except Exception as e:
            # debug(e)
            return False


    def get_tournemnt_data(self, id):
        try:
            tournment = Tournment.objects.get(id=id)
            tr_serializer = TournmentSerializer(tournment)
            return tr_serializer.data
        except :
            return None
        

    def serialize_user(self):
        try:
            user_serializer =  UserWithProfileSerializer(self.scope['user'])
            return user_serializer.data
        except :
            return None






class Tournament:

    lock = threading.Lock()

    def __init__(self, data):
        self.data = data
        self.builder = Builder(data['data']['players'])

    # async def run(self, level, id):
    #     match  = self.builder.get_player_match(level, id)
    #     debug(match)
    #     # # with self.lock:
    #     if match == None:
    #         debug("match not found")
    #     elif isinstance(match.val, Match) and match.val.status == 'waiting':
    #         match.val.status = 'playing'
    #     #     debug(f"start match btw left-{match.left.val.data['user_id']['id']} and right-{match.right.val.data['user_id']['id']}")
    #     #     await asyncio.sleep(4)
    #         match.val = match.left.val
    #     elif not isinstance(match.val, Match):
    #         debug("not a match")


    async def play(self, lvl, id):
        match = self.builder.get_player_match(lvl, id)
        assert match != None
        status = False
        with self.lock:
            if match and match.val.status == 'waiting':
                match.val.status = 'created'
                status = True
        if status == True:
            match_data = await self.create_match(match)
            if match_data:
                return match_data
        return None
            

    @database_sync_to_async
    def create_match(self, match):
        try:
            serializer = MatchSerializer(data = {
                "player_1" : int(match.left.val.data['id']),
                "player_2" : int(match.right.val.data['id']),
            })
            if serializer.is_valid():
                serializer.save()
                return serializer.data
            debug(f"serializer_errors => {serializer.errors}")
            return None
        except Exception as e:
            debug(f"exception => {e}")
            return None

class SharedState:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SharedState, cls).__new__(cls)
            cls._tournaments = {}
            cls.tournaments_providers = {}
            cls._instance.lock = asyncio.Lock()
        return cls._instance


class TournmentConsumer(AsyncWebsocketConsumer):
    
    
    def __init__(self):
        super().__init__()
        self.shared_state = SharedState()
        self.serialized_user = None
        self.tournment_id = None
        self.lvl = 1

    async def connect(self):
        await self.accept()
        self.tournment_id = self.scope['url_route']['kwargs']['id']
        self.group_name = f"tournment_{self.tournment_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)

        async with self.shared_state.lock:
            await self.init()
            await self.create_provider()
        




    async def init(self):
        if not self.shared_state._tournaments.get(self.tournment_id, None):
            current_tourament = await sync_to_async(self.get_tournemnt_data)(self.tournment_id)
            if current_tourament is None:
                return
            self.shared_state._tournaments[self.tournment_id] = {"data" : current_tourament, "user_count" : 0}
        self.shared_state._tournaments[self.tournment_id]['user_count'] += 1
        

    async def create_provider(self):
        debug(self.shared_state._tournaments[self.tournment_id]['user_count'])
        if self.shared_state._tournaments[self.tournment_id]['user_count'] == self.shared_state._tournaments[self.tournment_id]['data']['max_players']:
            self.shared_state.tournaments_providers[self.tournment_id] = Tournament(copy.deepcopy(self.shared_state._tournaments[self.tournment_id]))
            self.shared_state._tournaments[self.tournment_id]["rounds"] = self.shared_state.tournaments_providers[self.tournment_id].builder.get_rounds()
            debug("send provider data")
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type" : "send_data",
                    "data" : {
                        "data" : self.shared_state._tournaments[self.tournment_id],
                        "status" : 210
                    },
                }
            )
        

    async def receive(self, text_data=None):
        text_to_json_data = json.loads(text_data)
        if text_to_json_data['event'] == "start":
            debug("start event")
            provider = self.shared_state.tournaments_providers[self.tournment_id]
            id = await asyncio.create_task(provider.play(self.lvl, self.scope['user'].id))
            if id:
                await self.channel_layer.group_send(
                    self.group_name,    
                    {
                        "type" : "send_data",
                        "data" : {
                            "data" : id,
                            "status" : 211
                        },
                    })
            # self.lvl += 1





    async def send_data(self, event):
        json_data = json.dumps({"response" : event["data"]})
        await self.send(text_data=json_data)


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        async with self.shared_state.lock:
            self.shared_state._tournaments[self.tournment_id]['user_count'] -= 1
            debug(f"dec => {self.shared_state._tournaments[self.tournment_id]['user_count']}")
            if self.shared_state._tournaments[self.tournment_id]['user_count'] == 0:
                debug("delete")
                del self.shared_state._tournaments[self.tournment_id]
                del self.shared_state.tournaments_providers[self.tournment_id]
                debug(self.shared_state.tournaments_providers)
                debug(self.shared_state._tournaments)



    def get_tournemnt_data(self, id):
        try:
            tournment = Tournment.objects.get(id=id)
            tr_serializer = TournmentSerializer(tournment)
            return tr_serializer.data
        except :
            return None
