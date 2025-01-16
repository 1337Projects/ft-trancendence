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



    async def connect(self):
        await self.accept()
        self.tournment_id = self.scope['url_route']['kwargs']['id']
        self.group_name = f"tournment_{self.tournment_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)

        async with self.state.lock:
            await asyncio.sleep(0.5)
            await self.init()
            await self.create_provider()
        

    async def init(self):
        if not self.state.tournaments.get(self.tournment_id, None):
            current_tourament = await sync_to_async(self.get_tournemnt_data)(self.tournment_id)
            if current_tourament is None:
                return
            self.state.tournaments[self.tournment_id] = {"data" : current_tourament, "user_count" : 0}
        self.state.tournaments[self.tournment_id]['user_count'] += 1
        


    def set_tournament_status(self, status):
        try:
            tr = Tournment.objects.get(id=self.tournment_id)
            debug(tr)
            tr.tourament_status = status
            tr.save(0)
        except Exception as e:
            debug(f"set status fn {e}")



    async def create_provider(self):
        try:
            if self.state.tournaments[self.tournment_id]["data"]["tourament_status"] == "waiting":
                self.state.tournaments[self.tournment_id]["data"]["tourament_status"] = "ongoing"
                await sync_to_async(self.set_tournament_status)("ongoing")
                self.state.tournaments_providers[self.tournment_id] = Tournament(self.state.tournaments[self.tournment_id])
                self.state.tournaments[self.tournment_id]["rounds"] = self.state.tournaments_providers[self.tournment_id].builder.get_rounds()
                await asyncio.sleep(3)
                await self.brodcast({
                    "data" : self.state.tournaments[self.tournment_id],
                    "status" : 210
                })
        except Exception as e:
            debug(f"create provider {e}")
        

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
                if data["rounds"][0][0]["winner"] != 'unknown':
                    await sync_to_async(self.set_tournament_status)("ended")
                    builder = self.state.tournaments_providers[self.tournment_id].builder
                    await self.brodcast({
                        "data" : builder.tournament_rank(builder.tree),
                        "status" : 212
                    })

        except Exception as e:
            debug(f"receive => {e}")


    async def send_data(self, event):
        json_data = json.dumps({"response" : event["data"]})
        await self.send(text_data=json_data)


    async def disconnect(self, close_code):
        async with self.state.lock:
            self.state.tournaments[self.tournment_id]['user_count'] -= 1
            if self.state.tournaments[self.tournment_id]['user_count'] == 0:
                del self.state.tournaments[self.tournment_id]
                del self.state.tournaments_providers[self.tournment_id]

        await self.channel_layer.group_discard(self.group_name, self.channel_name)


    def get_tournemnt_data(self, id):
        try:
            tournment = Tournment.objects.get(id=id)
            tr_serializer = TournmentSerializer(tournment)
            return tr_serializer.data
        except :
            return None
