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
	
	if(msg=="ping")
	{
		console.log("Ping request from: "+rinfo.address+":"+rinfo.port);
		var dat=new Buffer("pong");
		server.send(dat,0,dat.length,rinfo.port,rinfo.address);
		return;
	}
	
	try {msg=JSON.parse(msg);}
	catch(e) {return;}
	
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
},1000/60);