import socket
import json
import threading

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
        print "Init connection with ip=%s, port=%s, timeout=%s" %(ip,port,timeout)
    def connect(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.setblocking(0)
        self.connected = True
        self.handle()
    def disconnect(self):
        self.connected = False
    def handle(self):
        #do send
        #do receive
        if(self.connected == True):
            threading.Timer(1.0,self.handle).start() # :/
        
    def send(self,msg):
        #print "Sending '%s' to %s:%s" % (msg,self.remote_ip,self.port)
        try:
            json_msg = json.dumps(msg)
            self.sock.sendto(json_msg,(self.remote_ip,self.port))
        except TypeError:
            print "Object could not be serialized"
    def receive(self):
        try:
            data,addr = self.sock.recvfrom(1024)
            return json.loads(data)
        except socket.error:
            return False
