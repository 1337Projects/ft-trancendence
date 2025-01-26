from tournment.utils.utils import debug
import copy


class TreeNode:
    def __init__(self, data, depth):
        self.left = None
        self.right = None
        self.val = data
        self.depth = depth


class Match:
    def __init__(self):
        self.status = 'waiting'

    def __str__(self):
        return self.status


class  Player:
    def __init__(self, data):
        self.data = data
    
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
    

    def get_rounds(self):
        rounds = []
        for r in self.rounds_list:
            rounds.append([])
            for match in r:
                rounds[-1].append({"player1" : self.get_val(match.left), "player2" : self.get_val(match.right)})
        rounds[0].append({"winner" : self.get_val(self.rounds_list[-1][0])})
        return rounds
    
    def searc_for_user(self, player):
        for index, user in enumerate(self.rank):
            if user['user']['id'] == player['id']:
                return index
        return -1

    def add_user(self, node):
        user = node.val.data
        user_id = self.searc_for_user(user)
        if user_id == -1:
            xp = (node.depth * 100) or 20
            self.rank.append({"user" : user, "xp" : xp})

    def print_tree(self, root):
        if root is None:
            return
        self.print_tree(root.left)
        debug(f"{root.val} - {root.depth}")
        self.print_tree(root.right)

    def tournament_rank(self, root):
        queue = []
        try:
            if root is None:
                return self.rank
            queue.append(root)
            while queue:
                current_node = queue.pop(0)
                self.add_user(current_node)
                if current_node.left:
                    queue.append(current_node.left)
                if current_node.right:
                    queue.append(current_node.right)
            self.add_user(root.val.data)
        except Exception as e:
            debug(f"Error in tournament_rank {e}")
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


