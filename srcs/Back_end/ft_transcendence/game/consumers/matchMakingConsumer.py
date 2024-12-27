
from channels.generic.websocket import  AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import secrets
import json
from account.serializer import UserWithProfileSerializer
from game.serializers import GameSerializer

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
            serializer = GameSerializer(data={
                "player1" : room['players'][0]['id'],
                "player2" : room['players'][1]['id'],
            })
            if serializer.is_valid():
                serializer.save()
                return serializer.data
            # debug(serializer.errors)
            return None
        except Exception as e:
            # debug(e)
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