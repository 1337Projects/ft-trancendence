
from channels.db import database_sync_to_async
from game.serializers import GameSerializer
from tournment.utils.TournamentBuilder import Builder
import asyncio



class TournamentData:
    instance = None

    def __new__(cls):
        if cls.instance is None:
            cls.instance = super(TournamentData, cls).__new__(cls)
            cls.instance.current_matches = []
            cls.instance.lock = asyncio.Lock()
        return cls.instance


class Tournament:

    def __init__(self, data):
        self.current_match = None
        self.state = TournamentData()
        self.builder = Builder()
        self.builder.init(data['data']['players'])


    def get_match(self, player_id):
        for match in self.state.current_matches:
            if match.left.val.data['id'] == player_id or \
                match.right.val.data['id'] == player_id:
                return match
        return None


    async def play(self, id):
        next_match = self.builder.get_player_match(id)
        if not next_match:
            return None
        async with self.state.lock:
            await asyncio.sleep(0.1)
            if next_match.val.status == 'waiting':
                self.state.current_matches.append(next_match)
                next_match.val.status = 'created'
                match_data = await self.create_match(next_match)
                return match_data
        return None
    

    async def upgrade(self, id):
        match = self.get_match(id)
        if match:
            if match.left.val.data['id'] == id:
                match.val = match.left.val
            elif match.right.val.data['id'] == id:
                match.val = match.right.val
            self.state.current_matches.remove(match)

    async def disconnectHandler(self, id):
        async with self.state.lock:
            match = self.builder.get_player_match(id)
            if match and match.left.val.data['id'] == id:
                match.val = match.right.val
            elif match and match.right.val.data['id'] == id:
                match.val = match.left.val


    @database_sync_to_async
    def create_match(self, match):
        try:
            serializer = GameSerializer(data = {
                "player1" : int(match.left.val.data['id']),
                "player2" : int(match.right.val.data['id']),
            })
            if serializer.is_valid():
                serializer.save()
                return serializer.data
            return None
        except Exception as e:
            return None

