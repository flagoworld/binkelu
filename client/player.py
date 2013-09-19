import cocos.cocosnode
import cocos.sprite
import math

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
        self.max_speed = 10
        self.target = pos
        print "Player init!"
    
    def move_to(self,target):
        self.target = target
        self.moving = True
    
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
        
        self.sprite.position = self.pos
        self.sprite.rotation = self.direction
        self.sprite.visit()