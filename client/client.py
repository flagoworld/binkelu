import cocos.custom_clocks
import sys
import networking
import time
import gamestate
from pyglet import clock

class Client():
    game = None
    def __init__(self):
        if(len(sys.argv) < 3):
            print "Usage: client.py <remote ip> <port>"
            quit()
            
        remote_ip = sys.argv[1]
        port = sys.argv[2]
        
        networking.connect(remote_ip,port,2,self.server_state)
        
        self.game = gamestate.GameState((640,480))

    def main(self):
        self.game.run("game")
        self.quit() #runs after the game ends
    
    def quit(self):
        networking.get().disconnect()

    def server_state(self,data,tick):
        #print "Recv: %s" % (data)
        self.game.scenes['game'].objs.player.update(data,tick)



if __name__ == "__main__":
    client = Client()
    client.main()
    