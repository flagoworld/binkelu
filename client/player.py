import cocos.cocosnode
import cocos.sprite
import math
import networking

class Player(cocos.cocosnode.CocosNode):
    def __init__(self,pos=(0,0)):
        super(Player,self).__init__()
        
        self.sprite = cocos.sprite.Sprite('res/gfx/player.png')
        #self.draw = self.sprite.draw
        
        self.id = id
        self.direction = 0
        self.pos = pos
        self.moving = False
        self.speed = 2
        self.target = pos
        
        self.ticks = 0
#        self.lerp_to = pos
        print "Player init!"
    
    def move_to(self,target):
        self.target = target
        self.moving = True
        d = {};
        d['moving'] = self.moving
        d['target'] = self.target
        networking.add_packet(d)
    
    def update(self,data,tick):
        self.moving = data['moving']
        self.target = (data['target'][0],data['target'][1])
        
        pos = data['pos']
        
        if(self.moving == True):
            while tick < networking.getTicks():
                pos = self.move(pos)
                if(pos == self.target):
                    self.moving = False
                    break

        #TODO: Lerp to new pos instead of snapping
        self.pos = pos

    def draw(self):
        self.sprite.draw()
    
    def visit(self):
#        s_pos = self.lerp_to
#        c_pos = self.pos
#        dist = math.sqrt((s_pos[0]-c_pos[0])**2+(s_pos[1]-c_pos[1])**2)
#        
#        if dist > 1 and dist < 8:
#            self.pos = (c_pos[0]+((c_pos[0]-s_pos[0])*0.5),c_pos[1]+((c_pos[1]-s_pos[1])*0.5))
#        else:
#            self.lerp_to = self.pos = s_pos
        
        if(self.moving == True):
            self.direction = 90-math.degrees(math.atan2(self.target[1]-self.pos[1],self.target[0]-self.pos[0]))
            self.pos = self.move(self.pos)
            
            if(self.pos == self.target):
                self.moving = False
        
        self.sprite.position = self.pos
        self.sprite.rotation = self.direction
        self.sprite.visit()
        self.resume()

    def move(self,start_pos):
        #handle movement
        px,py = start_pos
        tx,ty = self.target
        
        td = math.sqrt((tx-px)**2+(ty-py)**2)
        if(self.speed > td):
            return self.target
        else:
            dx = math.sin(math.radians(self.direction))*self.speed
            dy = math.cos(math.radians(self.direction))*self.speed
            return (start_pos[0]+dx,start_pos[1]+dy)