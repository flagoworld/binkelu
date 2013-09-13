import socket

class Connection():
    remote_ip = ""
    port = 0
    timeout = 0
    sock = None
    connected = False
    def __init__(self,ip,port,timeout=10):
        self.remote_ip = ip
        self.port = int(port)
        self.timeout = timeout
    def connect(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        #self.sock.bind(('127.0.0.1',self.port))
        self.connected = True
    def send(self,msg):
        print "Sending '%s' to %s:%s" % (msg,self.remote_ip,self.port)
        self.sock.sendto(msg,(self.remote_ip,self.port))
    def receive(self):
        data, addr = self.sock.recvfrom(1024)
        return data,addr