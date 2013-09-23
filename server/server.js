/*

Let's try this again... More like how Quake3 does it...

Client gives every action an incrementing ID and pushes it into the action list
Client sends array of actions to server, assigning the most recent action ID as the packet ID

Server sends out the state + sequence id of the entire game state to every client, including the client squence id of the last packet received from the client
Client receives state from server, updates local state, then removes all actions from action array whose ID <= client sequence ID passed in packet

Client packet (delta encoded client commands):

//	Packet ID    Command,etc    ,Params?         ,etc
	12345    ,command,command,command p1 p2 p3,command

Server packet (entire state):

//	Packet ID Last Client Packet ID,Key-value pairs outlining the state
	12345    ,12345                ,key,value,key,value,key,value










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

//Test server
var direction = 0;
var pos = [0,0];
var moving = false;
var speed = 0;
var acceleration = 0.1;
var max_speed = 2;
var target = pos;
var tmprinfo = false;
var cpid = -1;

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
	
	if(msg.type=="update")
	{
		tmprinfo=rinfo;
		
		var keys=Object.keys(msg.packets);
		keys.sort(function(a,b){return parseInt(a,10)-parseInt(b,10)});
		var len=keys.length;
		
		for(var i=0;i<len;++i)
		{
			if(parseInt(keys[i],10)<=cpid) continue;
			
			var p=msg.packets[keys[i]];
			
			if('moving' in p)
				moving=p.moving;
			
			if('target' in p)
				target=p.target;
		}
		
		if(parseInt(keys[len-1],10)>cpid) cpid=parseInt(keys[len-1],10);
	}
	
	return;
	
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

/*
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
*/

//Custom timer for physics?

function Timer(settings)
{
    this.settings = settings;
    this.timer = null;
 
    this.fps = settings.fps || 30;
    this.interval = Math.floor(1000/this.fps);
    this.timeInit = null;
         
    return this;
}
 
Timer.prototype = 
{   
    run: function()
    {
        var $this = this;
         
        this.settings.run();
        this.timeInit += this.interval;
 
        this.timer = setTimeout(
            function(){$this.run()}, 
            this.timeInit - (new Date).getTime()
        );
    },
     
    start: function()
    {
        if(this.timer == null)
        {
            this.timeInit = (new Date).getTime();
            this.run();
        }
    },
     
    stop: function()
    {
        clearTimeout(this.timer);
        this.timer = null;
    }
}

//Step physics
new Timer(
{
	fps:60,
	run:function()
	{
		if(moving)
		{
	        px = pos[0];
	        py = pos[1];
	        tx = target[0];
	        ty = target[1];
	        direction = 90-(Math.atan2(ty-py,tx-px)*(180/Math.PI));
	        
	        if(speed < max_speed)
	            speed += acceleration;
	        
	        td = Math.sqrt(Math.pow(tx-px,2)+Math.pow(ty-py,2));
	        if(speed > td)
	            speed = td;
	        
	        dx = Math.sin((direction)*(Math.PI/180))*speed;
	        dy = Math.cos((direction)*(Math.PI/180))*speed;
	        
	        pos = [pos[0]+dx,pos[1]+dy];
	        
	        if (pos[0] == tx && pos[1] == ty)
	        {
	            moving = false;
	            speed = 0;
	        }
	    }
	}
}).start();

//Step gamestate
setInterval(function()
{
	if(tmprinfo)
    {
     	var d={};
     	d.cpid=cpid;
     	d.pos=pos;
     	d.direction=direction;
     	d.moving=moving;
     	d.speed=speed;
     	d.acceleration=acceleration;
     	d.max_speed=max_speed;
     	d.target=target;
     	var msg=new Buffer(JSON.stringify(d));
     	server.send(msg,0,msg.length,tmprinfo.port,tmprinfo.address);
    }
},1000/10);