
from .utils import Game
from asgiref.sync import async_to_sync
from channels.generic.websocket import  AsyncConsumer, AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from channels.exceptions import StopConsumer
from django.db.models import Q
import secrets
import asyncio
import json
import time
import threading
from account.serializer import UserWithProfileSerializer
from .serializers import MatchSerializer
from .models import Match

from tournment.utils import debug

ROOMDATA_STATUS = 201
GAMEDATA_STATUS = 202
LAUNCHGAME_STATUS = 203
GAMEENDED_STATUS = 204


class GameMatchMakingConsumer(AsyncWebsocketConsumer):
    rooms = {}

    def __init__(self):
        super().__init__()
        self.serialized_user = None
        self.room_id = None


    async def connect(self):
        await self.accept()

        self.serialized_user = await self.get_user_from_db()
        self.room_id = self.get_room()

        if self.room_id == -1:
            name = secrets.token_hex(12)
            self.room_id = len(self.rooms)
            self.rooms[self.room_id] = {"name" : name, "status" : "waiting", "players" : [], "exec" : 0}

        room = self.rooms[self.room_id]
        room['players'].append(self.serialized_user)

        await self.channel_layer.group_add(
            room["name"],
            self.channel_name
        )

        await self.channel_layer.group_send(
            room['name'],
            {
                "type": "chat.message",
                "data" : {
                        "room" : { "room" : room },
                        "status" : ROOMDATA_STATUS
                    }
            }
        )

        if len(room['players']) == 2:
            room['status'] = 'started'
            match = await self.save_match_to_db(room)
            if match != None:
                await self.channel_layer.group_send(
                    room['name'],
                    {
                        "type" : "chat.message",
                        "data" : {
                            "game_id" : match['id'],
                            "status" : 203
                        }
                    }
                )


    async def chat_message(self, event):
        await self.send(text_data=json.dumps({"response" : event["data"]}))

    async def disconnect(self, close_code):
        room = self.rooms[self.room_id]
        await self.channel_layer.group_discard(
            room['name'],
            self.channel_name
        )
        if room['status'] == 'waiting':
            del self.rooms[self.room_id]


    @database_sync_to_async
    def save_match_to_db(self, room):
        try:
            serializer = MatchSerializer(data={
                "player_1" : room['players'][0]['id'],
                "player_2" : room['players'][1]['id'],
            })
            if serializer.is_valid():
                serializer.save()
                return serializer.data
            debug(serializer.errors)
            return None
        except Exception as e:
            debug(e)
            return None


    @database_sync_to_async
    def get_user_from_db(self):
        try:
            return UserWithProfileSerializer(self.scope["user"]).data
        except :
            return None
        
    def get_room(self):
        for room in self.rooms:
            if self.rooms[room]['status'] == 'waiting':
                return room
        return -1

class SharedState:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SharedState, cls).__new__(cls)
            cls._instance.lock = asyncio.Lock()
        return cls._instance


class GameConsumer(AsyncConsumer):

    matches = {}

    def __init__(self) -> None:
        # self.game_task = None
        # self.game = None
        self.match_id = None
        self.room_name = None
        self.shared_state = SharedState()

    async def websocket_connect(self, event):
        await self.send({"type" : "websocket.accept"})
        self.match_id = self.scope["url_route"]["kwargs"]["id"]
        self.room_name = f"room_{self.match_id}"

        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )

        match = self.matches.get(self.match_id, None)
        if match == None:
            match_data = await self.get_match_data(self.match_id)
            self.matches[self.match_id] = {"data" : match_data, "access" : 0}
        
        async with self.shared_state.lock:
            await asyncio.sleep(0.5)
            self.matches[self.match_id]['access'] += 1
            if self.matches[self.match_id]['access'] == 2:
                self.matches[self.match_id]["game"] = Game(self.matches[self.match_id]['data'])
                self.matches[self.match_id]["game_task"] = asyncio.create_task(self.game_loop())

    async def websocket_receive(self, text_data):
        text_data_json = json.loads(text_data["text"])
        # if text_data_json["event"] == "control":
        #     if self.game:
        #         self.game.update_paddles(text_data_json["action"])


    async def websocket_disconnect(self, event):
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )
        if self.matches[self.match_id]["game_task"]:
            # debug("cancel task")
            self.matches[self.match_id]["game_task"].cancel()
            self.matches[self.match_id]["game"].end = True 
        raise StopConsumer()


    async def chat_message(self, event):
        await self.send({
            "type": "websocket.send",
            "text": json.dumps({"response" : event["data"]})
        })


    @database_sync_to_async
    def get_match_data(self, id):
        try:
            match = Match.objects.get(id=id)
            serializer = MatchSerializer(match)
            return serializer.data
        except:
            return None
        




    async def game_loop(self):
        lastFrameTime = time.time()
        while True:
            currentTime = time.time()
            deltatime = currentTime - lastFrameTime
            lastFrameTime = currentTime
            self.matches[self.match_id]["game"].update(deltatime)
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "chat.message",
                    "data": {
                        "game" : self.matches[self.match_id]["game"].__dict__(),
                        "status" : 202
                    },

                }
            )
            if self.matches[self.match_id]["game"].end == True:
                break
            await asyncio.sleep(0.06)
            
