import cocos.custom_clocks
import sys
import networking
import time
import gamestate
from pyglet import clock

class Client():
    connection = None
    game = None
    def __init__(self):
        if(len(sys.argv) < 3):
            print "Usage: client.py <remote ip> <port>"
            quit()
            
        remote_ip = sys.argv[1]
        port = sys.argv[2]
        
        self.connection = networking.Connection(remote_ip,port)
        #self.connection.connect()
        self.game = gamestate.GameState((640,480))

    def main(self):
        self.game.run("game")
        self.quit() #runs after the game ends
    
    def quit(self):
        self.connection.disconnect()
    

if __name__ == "__main__":
    client = Client()
    client.main()
    