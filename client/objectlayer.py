import cocos
import player
import pyglet
import networking

class Objectlayer(cocos.layer.base_layers.Layer):
    is_event_handler = True
    def __init__(self):
        super(Objectlayer,self).__init__()
        self.player = player.Player((100,100))
        self.add(self.player)
        
    def on_mouse_press(self,x,y,buttons,modifiers):
        if(buttons == 1):
            self.player.move_to((x,y))

    def on_key_press(self,key,modifiers):
#        if(pyglet.window.key.symbol_string(key) == 'p'):
        networking.get().send('{"type":"ping"}')