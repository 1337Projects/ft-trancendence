from channels.generic.websocket import AsyncWebsocketConsumer
import sys

class TreeNode:
    def __init__(self, data):
        self.left = None
        self.right = None
        self.val = data

    def insert(self, node):
        if not self.right:
            self.right = node
        else:
            self.left = node


class Tournment:

    def __init__(self, tmp_data):
        self.data = tmp_data
        self.three = self.create_tournment_three()

    def create_tournment_three(self):

        pass



class TournmentConsumer(AsyncWebsocketConsumer):
    
    def __init__(self):
        self.tmp_tour = ["layer1", "player2", "layer3", "player4"]
        self.tour = Tournment(self.tmp_tour)
    

    async def start_match(self):
        # go througth the three and  start the match
        pass

    async def connect(self):

        # print(self.scope)
        # sys.stdout.flush()
        # get members nb
        # create a room withmax members set to nb
        # add user to room
        # send room data to the user
        # close the room when its full
        # create the three
        # dispatsh start event and call start_match
        await self.accept()

    async def receive(self, text_data=None):
        
        pass

    async def disconnect(self, close_code):
        # if status == waitng : del from room, close
        # if status == closed : inform others, close
        pass
