from channels.generic.websocket import AsyncWebsocketConsumer
from tournment.utils.TournamnetProvider import Tournament
from tournment.serializers import TournmentSerializer
from asgiref.sync import sync_to_async
from tournment.models import Tournment
from tournment.utils.utils import debug
import asyncio
import json



class TournamentConsumerSharedData:
    instance = None

    def __new__(cls):
        if cls.instance is None:
            cls.instance = super(TournamentConsumerSharedData, cls).__new__(cls)
            cls.instance.tournaments = {}
            cls.instance.tournaments_providers = {}
            cls.instance.lock = asyncio.Lock()
        return cls.instance


class TournmentConsumer(AsyncWebsocketConsumer):
    
    
    def __init__(self):
        super().__init__()
        self.state = TournamentConsumerSharedData()
        self.serialized_user = None
        self.tournment_id = None


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
        try:
            await self.accept()
            self.tournment_id = self.scope['url_route']['kwargs']['id']
            self.group_name = f"tournment_{self.tournment_id}"
            await self.channel_layer.group_add(self.group_name, self.channel_name)

            async with self.state.lock:
                await asyncio.sleep(0.1)
                await self.init()
                await self.create_provider()
        except Exception as e:
            debug(f"connect => {e}")
            await self.senderror("error in connection")
        

    def check_if_user_in_tournment(self, user_id):
        for player in self.state.tournaments[self.tournment_id]["data"]["players"]:
            if player["id"] == user_id:
                return True
        return False


    async def init(self):
        current_tourament = self.state.tournaments.get(self.tournment_id, None)
        if not current_tourament:
            tourament = await sync_to_async(self.get_tournemnt_data)(self.tournment_id)
            if tourament is None:
                raise Exception("tourament is None")
            self.state.tournaments[self.tournment_id] = {"data" : tourament, "user_count" : 0}
            current_tourament = self.state.tournaments[self.tournment_id]
        if current_tourament["data"]["tourament_status"] == "ended" or \
            (current_tourament["data"]["tourament_status"] == "ongoing" and \
            not self.check_if_user_in_tournment(self.scope['user'].id)):
                raise Exception("tourament is ended or user not in tournment")
        self.state.tournaments[self.tournment_id]['user_count'] += 1
        
        

    def set_tournament_status(self, status):
        tr = Tournment.objects.get(id=self.tournment_id)
        tr.tourament_status = status
        tr.save(0)



    async def create_provider(self):
        try:
            if self.state.tournaments[self.tournment_id]["data"]["tourament_status"] == "waiting":
                self.state.tournaments[self.tournment_id]["data"]["tourament_status"] = "ongoing"
                await sync_to_async(self.set_tournament_status)("ongoing")
                self.state.tournaments_providers[self.tournment_id] = Tournament(self.state.tournaments[self.tournment_id])
                self.state.tournaments[self.tournment_id]["rounds"] = self.state.tournaments_providers[self.tournment_id].builder.get_rounds()
                await asyncio.sleep(2)
                await self.brodcast({
                    "data" : self.state.tournaments[self.tournment_id],
                    "status" : 210
                })
        except Exception as e:
            debug(f"create provider {e}")
            raise Exception("error in create provider")
        



    async def receive(self, text_data=None):
        try:
            text_to_json_data = json.loads(text_data)
            if text_to_json_data["event"] == "start":
                provider = self.state.tournaments_providers[self.tournment_id]
                matchData = await asyncio.create_task(provider.play(self.scope['user'].id))
                if matchData:
                    await self.brodcast({
                        "data" : matchData,
                        "status" : 211
                    })

            elif text_to_json_data["event"] == "upgrade":
                debug("upgrade")
                provider = self.state.tournaments_providers[self.tournment_id]
                res = text_to_json_data["result"]
                if res["player1"]["id"] == self.scope['user'].id or \
                    res["player2"]["id"] == self.scope['user'].id:
                    await provider.upgrade(res['winner'])
                    builder = self.state.tournaments_providers[self.tournment_id].builder
                    self.state.tournaments[self.tournment_id]["rounds"] = builder.get_rounds()
                
            elif text_to_json_data["event"] == "get_data":
                data = self.state.tournaments[self.tournment_id]
                await self.brodcast({
                    "data" : data,
                    "status" : 210
                })
                await self.check_for_winner()
                

        except Exception as e:
            debug(f"receive => {e}")
            self.senderror("error in receive")


    async def check_for_winner(self):
        data = self.state.tournaments[self.tournment_id]
        if data["rounds"][0][0]["winner"] != 'unknown':
            self.state.tournaments[self.tournment_id]["data"]["tourament_status"] = "ended"
            await sync_to_async(self.set_tournament_status)("ended")
            builder = self.state.tournaments_providers[self.tournment_id].builder
            await self.brodcast({
                "data" : builder.tournament_rank(builder.tree),
                "status" : 212
            })

    async def send_data(self, event):
        json_data = json.dumps({"response" : event["data"]})
        await self.send(text_data=json_data)


    async def disconnect(self, close_code):
        try:
            async with self.state.lock:
                await self.state.tournaments_providers[self.tournment_id].disconnectHandler(self.scope['user'].id)
                
                builder = self.state.tournaments_providers[self.tournment_id].builder
                self.state.tournaments[self.tournment_id]["rounds"] = builder.get_rounds()
                await self.check_for_winner()
                
                self.state.tournaments[self.tournment_id]['user_count'] -= 1
                if self.state.tournaments[self.tournment_id]['user_count'] == 0:
                    del self.state.tournaments[self.tournment_id]
                    del self.state.tournaments_providers[self.tournment_id]

            await self.channel_layer.group_discard(self.group_name, self.channel_name)
        except Exception as e:
            debug(f"disconnect => {e}")
            self.senderror("error in disconnect")

    def get_tournemnt_data(self, id):
        try:
            tournment = Tournment.objects.get(id=id)
            tr_serializer = TournmentSerializer(tournment)
            return tr_serializer.data
        except :
            return None
