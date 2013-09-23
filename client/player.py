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
        self.speed = 0
        self.acceleration = 0.1
        self.max_speed = 2
        self.target = pos
        print "Player init!"
    
    def move_to(self,target):
        self.target = target
        self.moving = True
        d = {};
        d['moving'] = self.moving
        d['target'] = self.target
        networking.add_packet(d)
    
    def update(self,data):
        self.max_speed = data['max_speed']
        self.direction = data['direction']
        self.pos = (data['pos'][0],data['pos'][1])
        self.moving = data['moving']
        self.speed = data['speed']
        self.acceleration = data['acceleration']
        self.target = (data['target'][0],data['target'][1])
    
    def draw(self):
        self.sprite.draw()
    
    def visit(self):
        if(self.moving == True): #handle movement
            px,py = self.pos
            tx,ty = self.target
            self.direction = 90-math.degrees(math.atan2(ty-py,tx-px))
            
            if(self.speed < self.max_speed):
                self.speed += self.acceleration
            
            td = math.sqrt((tx-px)**2+(ty-py)**2)
            if(self.speed > td):
                self.speed = td
            
            dx = math.sin(math.radians(self.direction))*self.speed
            dy = math.cos(math.radians(self.direction))*self.speed
            
            self.pos = (self.pos[0]+dx,self.pos[1]+dy)
            
            if (self.pos == (tx,ty)):
                self.moving = False
                self.speed = 0
        
        #temporarily here. will be in a fixed timer later on.
        networking.send_packet()
        
        self.sprite.position = self.pos
        self.sprite.rotation = self.direction
        self.sprite.visit()
        self.resume()