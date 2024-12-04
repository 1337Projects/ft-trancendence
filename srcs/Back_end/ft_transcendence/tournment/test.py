import asyncio
import sys
from .utils import debug

class TreeNode:
    def __init__(self, data, depth, parent):
        self.left = None
        self.right = None
        self.parent = parent
        self.val = data
        self.depth = depth

# waiting | started |  finished
class Match:
    def __init__(self):
        self.status = 'waiting'

    # def __str__():
    #     return self.status


class  Player:
    def __init__(self, data):
        self.data = data

    # def __str__():
    #     return self.data

class Builder:

    def __init__(self, data):
        self.data = data
        self.rounds_list = []
        self.rounds = {}
        self.levels =  self.count_levels(len(data)) - 1
        for i in range(self.levels + 1):
            self.rounds_list.append([])
        self.tree = self.build_tree(self.levels, None)
        self.tree_to_rounds(self.tree)
        # debug(self.rounds_list)


    def count_levels(self,  list_len):
        if list_len == 4:
            return 3
        return (self.count_levels(list_len / 2) + 1)


    def build_tree(self, index, parent):

        if index == 0:
            my_player = Player(self.data.pop())
            root = TreeNode(my_player, index, parent)
            self.rounds_list[index].append(root)
            return root
        my_match = Match()
        root = TreeNode(my_match, index, parent)
        self.rounds_list[index].append(root)
        root.left = self.build_tree(index-1, my_match)
        root.right = self.build_tree(index-1, my_match)

        return root


    def get_val(self, root):
        if isinstance(root.val, Match):
            return 'unknown'
        return  root.val.data

    def make_rounds(self):
        self.rounds = {}
        self.tree_to_rounds(self.tree)

    def tree_to_rounds(self, root):

        if not self.rounds.get(f"round{root.depth}"):
            self.rounds[f"round{root.depth}"] = []

        if len(self.rounds[f"round{root.depth}"]) == 0:
            self.rounds[f"round{root.depth}"].append({"player1" : self.get_val(root)})


        elif not self.rounds[f"round{root.depth}"][-1].get("player2"):
            self.rounds[f"round{root.depth}"][-1]["player2"] = self.get_val(root)
            self.rounds[f"round{root.depth}"][-1]["status"] = root.parent.status

        else:
            self.rounds[f"round{root.depth}"].append({"player1" : self.get_val(root)})


        if root.left:
            self.tree_to_rounds(root.left)
        if root.right:
            self.tree_to_rounds(root.right)


    def get_player_match(self, level, id):
        my_list = self.rounds_list[level]
        debug(f"{level} - {my_list}")
        # debug("----------")
        for item in my_list:
            try:
                left_node = item.left
                if left_node and isinstance(left_node.val, Player):
                    user = left_node.val.data
                    if user['id'] == id:
                        return item
                    
                right_node = item.right
                if right_node and isinstance(right_node.val, Player):
                    user = right_node.val.data
                    if user['id'] == id:
                        return item
            except:
                pass
        # debug("----------")
        return None


    def get_rounds(self):
        ret = []
        for key, value in self.rounds.items():
            ret.append(value)
        ret.reverse()
        ret.pop()
        return ret

    def get_match_at_given_level(self, level, start, root):
 
        if root.depth == level and isinstance(root.val, Match) and  root.val.status == 'waiting':
            return root
     
        if  root.left:
            match = self.get_match_at_given_level(level, start - 1, root.left)
            if  match:
                return match
        if root.right:
            match = self.get_match_at_given_level(level, start - 1, root.right)
            if  match:
                return match
    
    async def start_match(self, match):

        match.val.status = 'started'

        print("started")
        print(f"match {match.left.val.data} vs {match.right.val.data}")
        await asyncio.sleep(2)
        match.val = match.left.val

        

    def iterate_over_matches(self, level):

        match =  self.get_match_at_given_level(level, self.levels, self.tree)

        while match !=  None:
            asyncio.run(self.start_match(match))
            match  = self.get_match_at_given_level(level, self.levels, self.tree)
        print("---------------")

    async def iterate_over_matches2(self, level):
        match =  self.get_match_at_given_level(level, self.levels, self.tree)
        matches = []
        while match !=  None:
            matches.append(match)
            # await self.start_match(match)
            match.val.status = 'started'
            match  = self.get_match_at_given_level(level, self.levels, self.tree)
        tasks = [self.start_match(match) for match in matches]
        bacth = asyncio.gather(*tasks)
        await  bacth
        print("---------------")

    def play_tournment_local_mode(self, level):
        if level == 0:
            return
        self.play_tournment_local_mode(level - 1)
        self.iterate_over_matches(level)


    async def  play_tournment_remote_mode(self, level):
        if level == 0:
            return
        self.play_tournment_remote_mode(level - 1)
        asyncio.run(self.iterate_over_matches2(level))


if  __name__ == "__main__":
    tmp = ["1","2","3","4", "5","6","7","8",]
    builder = Builder(tmp)
    print(builder.get_rounds())
    sys.stdout.flush()
    # builder.play_tournment_remote_mode(builder.levels)
    # print(builder.get_rounds())
    

