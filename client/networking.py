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
        self.connected = True
    def send(self,msg):
        print "Sending '%s' to %s:%s" % (msg,self.remote_ip,self.port)
        self.sock.sendto(msg,(self.remote_ip,self.port))