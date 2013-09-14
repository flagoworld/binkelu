import player

class Game():
    game_id = -1
    objs = list()
    def __init__(self):
        self.objs.append(player.Player(1,(50,300)))
        self.objs.append(player.Player(2,(550,300)))
        print "Game init!"
        
    def update(self):
        for obj in objs:
            obj.update()