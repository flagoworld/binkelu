import cocos.layer.base_layers
import cocos
import time
import objectlayer

class Game(cocos.scene.Scene):
    def __init__(self):
        super(Game,self).__init__()
        self.game_id = -1
        self.objs = objectlayer.Objectlayer()
        self.add(self.objs)
        print "Game init!"
    
    def add_object(self,object):
        self.objs.add(object)
        return True
        
    #def update(self):
    #   for obj in objs:
    #   obj.update()
    #def draw(self):
    #    super(Game,self).draw()
    #    #print "lol"
    #    
    #    time.sleep(1.0/30.0)
        