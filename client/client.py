import sys,networking

class Client():
    connection = None
    def __init__(self):
        if(len(sys.argv) < 3):
            print "Usage: client.py <remote ip> <port>"
            quit()
            
        remote_ip = sys.argv[1]
        port = sys.argv[2]
        self.connection = networking.Connection(remote_ip,port)
        self.connection.connect()

    def main(self):
        self.connection.send("Hello World!")
        while True:
            data,addr = self.connection.receive()
            print "Received %s from %s" % (data,addr)
        

if __name__ == "__main__":
    client = Client()
    client.main()
    