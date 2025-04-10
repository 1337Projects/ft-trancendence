
import asyncio
from channels.generic.websocket import  AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import secrets
import json
from account.serializer import UserWithProfileSerializer
from game.serializers import GameSerializer
from game.serializers import TicTacTeoSerializer
from django.contrib.auth.models import AnonymousUser



class SharedState:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.lock = asyncio.Lock()
            cls._instance.rooms = {}
        return cls._instance
    

class SharedStateT:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.lock = asyncio.Lock()
            cls._instance.rooms = {}
        return cls._instance

class GameMatchMakingConsumer(AsyncWebsocketConsumer):


    def __init__(self):
        super().__init__()
        self.shared_data = SharedState()
        self.serialized_user = None
        self.room_id = None


    async def brodcast(self, data, group_name):
        await self.channel_layer.group_send(
            group_name,
            {
                "type": "send.message",
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

        if isinstance(self.scope['user'], AnonymousUser):
            await self.close()
            return

        try :
            self.serialized_user = await self.get_user_from_db()
            room_name = self.scope["url_route"]["kwargs"]["room_id"]
            room_type = self.scope["url_route"]["kwargs"]["type"]
            
            async with self.shared_data._instance.lock:

                self.room_id = self.get_room(room_name, room_type)
                if self.room_id == -1:
                    name = room_name
                    if name == 'any':
                        name = secrets.token_hex(12)
                    self.room_id = len(self.shared_data._instance.rooms)
                    self.shared_data._instance.rooms[self.room_id] = {"name" : name, "privacy" : room_type, "status" : "waiting", "players" : [], "exec" : 0}
                room = self.shared_data._instance.rooms[self.room_id]
                room['players'].append(self.serialized_user)
                await self.channel_layer.group_add(
                    room["name"],
                    self.channel_name
                )

                await self.brodcast({
                    "room" : { "room" : room },
                    "status" : 201
                }, room["name"])
                
                if len(room['players']) == 2:
                    room['status'] = 'started'
                    match = await self.save_match_to_db(room)
                    if not match:
                        raise Exception("Error in creating match")
                    await self.brodcast({
                        "game_id" : match['id'],
                        "status" : 203
                    }, room["name"])
        except Exception as e:
            await self.senderror("Error in connection")



    async def send_message(self, event):
        await self.send(text_data=json.dumps({"response" : event["data"]}))


    async def disconnect(self, close_code):
        try:
            room = self.shared_data._instance.rooms.get(self.room_id, None)
            if room:
                await self.channel_layer.group_discard(
                    room['name'],
                    self.channel_name
                )
                del self.shared_data._instance.rooms[self.room_id]
        except:
            await self.senderror("somthing went wrong")


    @database_sync_to_async
    def save_match_to_db(self, room):
        try:
            serializer = GameSerializer(data={
                "player1" : room['players'][0]['id'],
                "player2" : room['players'][1]['id'],
            })
            if serializer.is_valid():
                serializer.save()
                return serializer.data
            return None
        except:
            return None


    @database_sync_to_async
    def get_user_from_db(self):
        try:
            return UserWithProfileSerializer(self.scope["user"]).data
        except :
            return None
        


    def get_room(self, room_name, room_type):
        try:
            if room_name == 'any' and room_type == 'public':
                for key, room in self.shared_data._instance.rooms.items():
                    if room['status'] == 'waiting' and \
                        room['privacy'] == 'public' and \
                        room['players'][0]['id'] != self.serialized_user['id']:
                        return key
            else:
                for key, room in self.shared_data._instance.rooms.items():
                    if room['status'] == 'waiting' and \
                        room['name'] == room_name and \
                        room['privacy'] == room_type and \
                        room['players'][0]['id'] != self.serialized_user['id']:
                        return key
        except:
            return -1
        return -1
    




class TicTakTeoMatchMaking(GameMatchMakingConsumer):

    def __init__(self):
        super().__init__()
        self.shared_data = SharedStateT()
        self.serialized_user = None
        self.room_id = None


    @database_sync_to_async
    def save_match_to_db(self, room):
        try:
            serializer = TicTacTeoSerializer(data={
                "player1" : room['players'][0]['id'],
                "player2" : room['players'][1]['id'],
            })
            if serializer.is_valid():
                serializer.save()
                return serializer.data
            return None
        except Exception as e:
            return None