/*

Let's try this again...

Client gives every action an incrementing ID and pushes it into the action list
Client sends array of actions to server, assigning the most recent action ID as the packet ID

Server sends out the state + sequence id of the entire game state to every client, including the client squence id of the last packet received from the client
Client receives state from server, updates local state, then removes all actions from action array whose ID <= client sequence ID passed in packet



––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
Below is the old method I was thinking of. Disregard it as I will modify it to match the above.
––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––



Client Commands
–––––––––––––––––––––––––
Challenge,
Start a game or resume a game in progress
{
	"type":"challenge",
	"user_id":"12345"
}

Update,
Notify the server that the player is doing something
The idea is that the client continues to send state values that don't match the server's state
The client will stop sending a state value once it receives a state value from the server that conflicts with the change it
For instance, if the user tries to put a card on the ground, the client keeps sending the information that the card is there
Once the server actually receives the message, it determines that the user is trying to play a card and takes it from their inventory
Once the card is actually played, the state updates sent to the user will include it since it is visible
At this time, the client will see the conflicting message and cease to send the state update

If the opponent has not been active for 15 seconds, the client has the option of accepting the win within the next 45 seconds
If the client does not accept the win, they get it anyways
During this time, they may validly include the "winner" state
{
	"type":"update",
	"session_id":"12345",
	"state":
	{
		"moving":"x,y",
		"cards":
		[
			{
				"id":"12345",
				"position":"x,y"
			}
		],
		"win":"1"
	}
	"moving":"x,y",
}
–––––––––––––––––––––––––

Server Responses
–––––––––––––––––––––––––

State,
The server sends the current game state to all clients in a game
The current game state contains the positions of all objects visible to the client
If the server state doesn't contain an object, it is assumed by the client to no-longer exist?
{
	"winner":"1 or 2",
	"begin":"0 or 1"
	"players":
	[
		{
			"id":"12345",
			"position":"x,y",
			"health":"100",
			"etc":"etc"
		}
	],
	"cards":
	[
		{
			"id":"12345",
			"position":"x,y"
		}
	]
}

–––––––––––––––––––––––––

*/
var dgram=require("dgram");
var uuid=require("uuid");
//var zlib=require("zlib");

function clone(obj)
{
	if(null==obj||"object"!=typeof obj) return obj;
	var copy=obj.constructor();
	for(var attr in obj)
		if(obj.jasOwnProperty(attr)) copy[attr]=obj[attr];
	return copy;
}

function step_game(game)
{
//Step the game! AI! Etc!
}

//Each Player
var Player=function(id)
{
	this.id=id;
	this.secret=uuid.v4();
	this.rinfo;
	this.last_update=process.hrtime();
	
	this.state=
	{
		speed:0,
		angle:0,
		moving:0
	};
	
	//This will be a special case and will be sent with the state once per second
	this.name="";

//We don't need this because the player states are sent every tick anyways	
/*
	this.updates={};
	
	var player=this;
	
	this.update=function(key,val)
	{
		if(typeof player.state[key]===undefined) return;
		player.state[key]=val;
		player.updates[key]=val;
	};
*/
};


//Each game
var Game=function()
{
	//Setup default game
	this.id=uuid.v4();
	this.players=[];
	this.state={};
	this.updates={};
	
	var game=this;
	
	this.update=function(key,val)
	{
		if(typeof game.state[key]===undefined) return;
		game.state[key]=val;
		game.updates[key]=val;
	};
	
	this.addPlayer=function(player)
	{
		game.players.push(player);
	};
};

//All the games
var games=[];
var players=[];

//The server
var server=dgram.createSocket("udp4");

server.on("error",function(err)
{
	console.log("Server Error: \n"+err.stack);
});

server.on("message",function(msg,rinfo)
{
	//Just kidding. Don't do this. Packet data is so small that it adds extra bytes anyways
/*
	//Decode packet data
	zlib.gunzip(msg,function(err,data)
	{
		
	});
*/
	
	try {msg=JSON.parse(msg);}
	catch(e) {return;}
	
	if(msg.type=="ping")
	{
		var dat=new Buffer(JSON.stringify({type:"pong"}));
		server.send(dat,0,dat.length,rinfo.port,rinfo.address);
		return;
	}
	
	//Is it a game challenge or a state update?
	if(typeof msg.game_id===undefined)
	{
		//If qualifying game exists and has a free spot
			//Generate session ID and send back game ID + session id
		//Else
			//Generate session ID and new game ID and send back to user
	}else
	{
		//Verify game ID and session ID, or return
		//Verify state changes, or return
		//Apply state changes
		//Update player last_update
	}
});

server.on("listening",function()
{
	var address=server.address();
	console.log("Listening: \n"+address.address+":"+address.port);
});

server.bind(13370);

//Start game tick, 60/sec
var tick_time=process.hrtime();

setInterval(function()
{
	var game_count=games.length;
	var game_number=0
	
	var relay_entire_state=0;
	var tick_diff=process.hrtime(tick_time);
	
	if(tick_diff[0]>0)
	{
		tick_time=process.hrtime();
		relay_entire_state=1;
	}
	
	//Loop through games
	for(;game_number<game_count;++game_number)
	{
		var game=games[game_number];
		
		step_game(game);
		
		var state=
		{
			game_id:game.id,
			players:[]
		};
		
		//Should we relay the entire gamestate?
		if(relay_entire_state>0)
			state.game_state=game.state;
		else
			state.game_state=game.updates;
		
		var player_count=game.players.length;
		
		for(var i=0;i<player_count;++i)
		{
			state.players.push(clone(game.players[i].state));
			
			if(relay_entire_state>0)
				state.players[i].name=game.players[i].name;
			
			state.players[i].id=game.players[i].id;
		}
		
		var msg=new Buffer(JSON.stringify(state));
		
		for(var i=0;i<player_count;++i)
		{
			var rinfo=game.players[i].rinfo;
			server.send(msg,0,msg.length,rinfo.port,rinfo.address);
		}
	}
},1000/30);