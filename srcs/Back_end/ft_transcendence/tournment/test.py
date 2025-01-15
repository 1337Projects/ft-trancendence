from tournment.utils import debug
import copy
class TreeNode:
    def __init__(self, data, depth):
        self.left = None
        self.right = None
        self.val = data
        self.depth = depth

# waiting | started |  finished
class Match:
    def __init__(self):
        self.status = 'waiting'

    def __str__(self):
        return self.status


class  Player:
    def __init__(self, data):
        self.data = data

    def __str__(self):
        return self.data

class Builder:

    def __init__(self):
        self.tree = None
        self.levels_num = None
        self.rounds_list = []
        self.rank = []


    def init(self, data):
        self.data = copy.deepcopy(data)
        self.levels_num = self.count_levels(len(self.data)) - 1
        for _ in range(self.levels_num + 1):
            self.rounds_list.append([])
        self.tree = self.build_tree(self.levels_num)


    def count_levels(self, list_len):
        if list_len == 4:
            return 3
        return (self.count_levels(list_len / 2) + 1)


    def build_tree(self, index):
        if index == 0:
            root = TreeNode(Player(self.data.pop()), index)
            # self.rounds_list[index].append(root)
            return root
        root = TreeNode(Match(), index)
        self.rounds_list[index].append(root)
        root.left = self.build_tree(index-1)
        root.right = self.build_tree(index-1)
        return root
    
    def get_val2(self, root):
        if isinstance(root.val, Match):
            return 'unknown'
        return  root.val.data["username"]
    
    def myprint(self, root):
        if root == None:
            return
        debug(f"print tree node {root.depth} => {self.get_val2(root)}")
        self.myprint(root.left)
        self.myprint(root.right)


    def get_rounds(self):
        rounds = []
        for r in self.rounds_list:
            rounds.append([])
            for match in r:
                rounds[-1].append({"player1" : self.get_val(match.left), "player2" : self.get_val(match.right)})
        rounds[0].append({"winner" : self.get_val(self.rounds_list[-1][0])})
        # rounds.reverse()
        # rounds.pop()
        # rounds.reverse()
        return rounds
    

    def tournament_rank(self, root):
        queue = []

        if root is None:
            return self.rank
        
        queue.append(root)
        if not root.val.data in self.rank:
            self.rank.append(root.val.data)
        while queue:

            current_node = queue.pop(0)

            if current_node.left:
                queue.append(current_node.left)
                if not current_node.left.val.data in self.rank:
                    self.rank.append(current_node.left.val.data)
            if current_node.right:
                queue.append(current_node.right)
                if not current_node.right.val.data in self.rank:
                    self.rank.append(current_node.right.val.data)

        return self.rank
        
    


    def get_val(self, root):
        if isinstance(root.val, Match):
            return 'unknown'
        return  root.val.data
    

    def get_player_match(self, id):

        for level in self.rounds_list:
            for item in level:
                if isinstance(item.val, Player):
                    continue
                try:
                    left_node = item.left
                    if left_node and isinstance(left_node.val, Player):
                        user = left_node.val.data
                        if user['id'] == id and isinstance(item.right.val, Player):
                            return item
                        
                    right_node = item.right
                    if right_node and isinstance(right_node.val, Player):
                        user = right_node.val.data
                        if user['id'] == id and isinstance(item.left.val, Player):
                            return item
                except:
                    pass
        return None



if __name__ == "__main__":
    for i in range(0, 10, 2):
        print(f"{i} - {i + 1}")