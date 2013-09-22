import socket
import json
import threading
import select

__singleton = None

def connect(ip,port,timeout=10,callback=None):
    global __singleton
    __singleton=Connection(ip,port,timeout,callback)
    __singleton.connect()

def get():
    global __singleton
    return __singleton

class Connection():
    remote_ip = ""
    port = 0
    timeout = 0
    sock = None
    connected = False
    recv_callback = None
    
    def __init__(self,ip,port,timeout=10,callback=None):
        self.recv_callback=callback
        self.remote_ip = ip
        self.port = int(port)
        self.timeout = timeout
        print "Init connection with ip=%s, port=%s, timeout=%s" %(ip,port,timeout)
    def connect(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.setblocking(0)
        self.sock.bind(('',self.port))
        self.connected = True
        threading.Thread(target=self.receive).start()
    
    def disconnect(self):
        self.connected = False
        
    def send(self,msg):
        print "Sending '%s' to %s:%s" % (msg,self.remote_ip,self.port)
        self.sock.sendto(msg,(self.remote_ip,self.port))
    
    def receive(self):
        while self.connected:
            do_read = False
            try:
                r,_,_ = select.select([self.sock],[],[],self.timeout)
                do_read = bool(r)
            except socket.error:
                pass
            
            if do_read:
                data,addr = self.sock.recvfrom(1024)
                if self.recv_callback is not None:
                    self.recv_callback(data)