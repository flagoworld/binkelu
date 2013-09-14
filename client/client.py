import sys
import networking
import game
import time

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
        self.connection.connect()
        self.game = game.Game()

    def main(self):
        ping_obj = {"type":"ping"}
        self.connection.send(ping_obj)
        #self.connection.send(self.game)
        while True:
            response = self.connection.receive()
            if response:
                print response
            time.sleep(1) #just so the server doesnt get spammed for now
        
    

if __name__ == "__main__":
    client = Client()
    client.main()
    