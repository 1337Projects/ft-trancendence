from channels.generic.websocket import AsyncWebsocketConsumer
from tournment.models import Tournment
from asgiref.sync import sync_to_async
from tournment.serializers import TournmentSerializer
import json
from account.serializer import UserWithProfileSerializer
from tournment.utils.utils import debug
from login.models import User


class MatchMakeingConsumer(AsyncWebsocketConsumer):

    tournaments = {}

    def __init__(self):
        super().__init__()
        self.tournment_id = None
        self.group_name = None
        self.serialized_user = None


    async def brodcast(self, data):
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type" : "send_data",
                "data" : data
            }
        )
    
    async def senderror(self, error):
        res = {
            "status" : 400,
            "error" : error
        }
        await self.send(text_data=json.dumps({"response" : res}))


    async def connect(self):
        await self.accept()
        self.tournment_id = self.scope['url_route']['kwargs']['id']
        self.group_name = f"tournament_{self.tournment_id}"

        try:
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
                await self.brodcast({
                    "data" : current_turnament,
                    "status" : 100
                })
               
            if len(current_turnament['players']) == current_turnament['data']['max_players']:
                await sync_to_async(self.add_players_to_db)()
        except Exception as e:
            await self.senderror(e)
            debug(e)
            

    async def send_data(self, event):
        await self.send(text_data= json.dumps({"response" : event["data"]}))


    async def disconnect(self, code):
        try:
            del self.tournaments[self.tournment_id]['players'][self.scope['user'].id]
            if len(self.tournaments[self.tournment_id]['players']) == 0:
                del self.tournaments[self.tournment_id]
                debug(self.tournaments)
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
            await self.brodcast({
                "status" : 100,
                "data" : self.tournaments[self.tournment_id]
            })
        except Exception as e:
            await self.senderror(e)
            debug(e)



    def add_players_to_db(self):
        try:
            current_tournament = self.tournaments[self.tournment_id]
            tournment = Tournment.objects.get(id=self.tournment_id)
            for player in current_tournament['players'].values():
                try:
                    current_player = User.objects.get(id=player['id'])
                    tournment.players.add(current_player)
                except Exception as e:
                    continue
        except Exception as e:
            debug(e)


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