var dgram=require("dgram");
var server=dgram.createSocket("udp4");

server.on("error",function(err)
{
	console.log("Server Error: \n"+err.stack);
});

server.on("message",function(msg,rinfo)
{
	console.log("Message: \n"+msg+" from "+rinfo.address+":"+rinfo.port);
});

server.on("listening",function()
{
	console.log("Listening: \n"+address.address+":"+address.port);
});

server.bind(13370);