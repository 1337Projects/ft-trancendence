from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
from .models import Tournment
from  asgiref.sync import sync_to_async
from .serializers import TournmentSerializer, PlayerSerializer
from .test import Builder, Player
import json, copy
from account.serializer import UserWithProfileSerializer
import threading
from .utils import debug


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
        del current_tournament['players'][self.scope['user'].id]

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
                    current_player = Player.objects.get(user_id=player['id'])
                except:
                    player_serializer = PlayerSerializer(data={"user_id" : player['id']})
                    if player_serializer.is_valid():
                        player_serializer.save()
                        current_player = player_serializer.instance
                try:
                    tournment.players.add(current_player)
                except Exception as e:
                    # debug(e)
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

    def __init__(self, data):
        self.data = data
        self.builder = Builder(data['data']['players'])



    def run(self):
        pass



    async def start(self):
        debug('start')
        pass








class TournmentConsumer(AsyncWebsocketConsumer):
    
    tournments = {}
    lock = threading.Lock()

    def __init__(self):
        super().__init__()
        self.serialized_user = None
        self.builder = None
        self.tournment_id = None


    async def connect(self):

        await self.accept()
        self.tournment_id = self.scope['url_route']['kwargs']['id']
        self.group_name = f"tournment_{self.tournment_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)

        if not self.tournments.get(self.tournment_id, None):
            current_tourament = await sync_to_async(self.get_tournemnt_data)(self.tournment_id)
            if current_tourament is None:
                return
    
            self.tournments[self.tournment_id] = {"data" : current_tourament, "users_count" : 0}
        with self.lock:
            self.tournments[self.tournment_id]['users_count'] += 1
        if self.tournments[self.tournment_id]['users_count'] == self.tournments[self.tournment_id]['data']['max_players']:
            self.builder = Tournament(copy.deepcopy(self.tournments[self.tournment_id]))
            self.tournments[self.tournment_id]["rounds"] = self.builder.builder.get_rounds()
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type" : "send_data",
                    "data" : {
                        "data" : self.tournments[self.tournment_id],
                        "status" : 210
                    },
                }
            )
            await self.builder.start()


    async def send_data(self, event):
        json_data = json.dumps({"response" : event["data"]})
        await self.send(text_data=json_data)


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        self.tournments[self.tournment_id]['users_count'] -= 1
        if self.tournments[self.tournment_id]['users_count'] == 0:
            del self.tournments[self.tournment_id]


    def get_tournemnt_data(self, id):
        try:
            tournment = Tournment.objects.get(id=id)
            tr_serializer = TournmentSerializer(tournment)
            return tr_serializer.data
        except :
            return None
