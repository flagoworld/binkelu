import cocos
import player

class Objectlayer(cocos.layer.base_layers.Layer):
    is_event_handler = True
    def __init__(self):
        super(Objectlayer,self).__init__()
        self.player = player.Player((100,100))
        self.add(self.player)
        
    def on_mouse_press(self,x,y,buttons,modifiers):
        if(buttons == 1):
            self.player.move_to((x,y))