import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from game.backend.pong_game_backend import PongGameManager
from game.models import Game
from channels.db import database_sync_to_async
from login.models import User

class GameConsumer(AsyncWebsocketConsumer):
    pongGameManager = PongGameManager()

    async def connect(self):
        """
        Handles the WebSocket connection for a game.

        This method is called when a WebSocket connection is established. It performs the following actions:
        1. Retrieves the game ID from the URL route.
        2. Constructs the room name using the game ID.
        3. Fetches the game object from the database.
        4. Checks if the user is a player in the game.
        5. Adds the WebSocket channel to the channel layer group for the game room.
        6. Accepts the WebSocket connection.
        7. Adds the user to the game using the PongGameManager.
        8. Starts a timeout check to disconnect the first player if the second player doesn't join in time.

        Raises:
            Game.DoesNotExist: If the game with the specified ID does not exist.
            User.DoesNotExist: If the user is not a player in the game.
        """
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.player = self.scope['user']
        self.room_name = f'game_{self.game_id}'

        game = await database_sync_to_async(Game.objects.get)(id=self.game_id)

        player1_id = await database_sync_to_async(lambda: game.player1.id)()
        player2_id = await database_sync_to_async(lambda: game.player2.id)()

        if self.player.id != player1_id and self.player.id != player2_id:
            await self.close(code=4000)
            return

        self.channel_layer = get_channel_layer()
        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )
        await self.accept()
        await self.pongGameManager.add_player_to_game(game, self.player, self.room_name)
    
    async def disconnect(self, close_code):
        """ Handles the WebSocket disconnection for a game."""
        if close_code == 1000:
            # await self.pongGameManager.remove_player_from_game(self.room_name, self.player.id)
            await self.channel_layer.group_discard(
                self.room_name,
                self.channel_name
            )
        else:
            # assert False, f"Unexpected close code: {close_code}"
            pass


    async def start_game(self, event):
        # Ensure event is serializable
        stats = event['stats']
        await self.send(text_data=json.dumps({'stats': stats}))
    
