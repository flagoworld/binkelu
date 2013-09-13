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
	
	//Decode packet data
	
	//If `type`=`challenge`
		//If qualifying game exists and has a free spot
			//Generate session ID and send back game ID + session id
		//Else
			//Generate session ID and new game ID and send back to user
	
	//If `type`=`update`
		//Verify game ID and session ID, or return
		//Verify state changes, or return
		//Apply state changes
});

server.on("listening",function()
{
	var address=server.address();
	console.log("Listening: \n"+address.address+":"+address.port);
});

server.bind(13370);

//Start game tick
	//Loop through games
		//Update timers, AI, etc
		//If tick%60
			//Send entire gamestate to connected players
		//Else
			//Prepare all things that were updated to be sent (state changes)
			//Encode state changes
			//Send state changes to connected players