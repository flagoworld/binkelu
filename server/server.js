var dgram=require("dgram");
var server=dgram.createSocket("udp4");

server.on("error",function(err)
{
	console.log("Server Error: \n"+err.stack);
});

server.on("message",function(msg,rinfo)
{
	console.log("Message: \n"+msg+" from "+rinfo.address+":"+rinfo.port);
	
	var msg=new Buffer("Gotcha!");
	server.send(msg,0,msg.length,rinfo.port,rinfo.address,function(err,bytes)
	{
		console.log("Replied.");
	});
});

server.on("listening",function()
{
	var address=server.address();
	console.log("Listening: \n"+address.address+":"+address.port);
});

server.bind(13370);