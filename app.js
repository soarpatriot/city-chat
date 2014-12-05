var http = require('http'),
    fayeRedis = require('faye-redis'),
    redis = require("redis"),
    client = redis.createClient(),
    faye = require('faye');

var server = http.createServer(),
    bayeux = new faye.NodeAdapter({
    	mount: '/faye',
    	timeout: 45,
      
      engine: {
		    type:   fayeRedis,
		    host:   'localhost',
		    port: 6379,
		    namespace: 'city'
		    // more options
		  }
});

bayeux.on('handshake', function(clientId) {
   console.log("client handshake: "+ clientId);
   channel = "city/channels/"+clientId;
   
   //initDate(channel);
   send(channel,"welcome haha");
   //send("/chat","welcome");
});

bayeux.on('subscribe', function(clientId,channel) {
   isPrivate = /\/channels\/\d+/.test(channel);

   console.log("not private"+channel)

   if(channel === '/chat' ){
      
   }
   if(isPrivate){
      console.log("private");
      initDate(channel);
      //send(channel,"welcome haha");
   }

   //send("/chat","welcome");
});



bayeux.on('publish', function(clientId,channel,data) {
   console.log("a message incoming, from: "+ clientId + "   channel:"+channel + "   data:" + data.text );

   if(channel === '/chat'){
     client.rpush('city/channels/chat/messages', JSON.stringify(data)); //JSON.stringify(data)
   }
   
   //send("chat","welcome");
   //getRange();

   //getLength();
});

function getLength(){
  client.llen('city/channels/chat/messages',function(error, length){
    console.log("length: " + length);
  });
}
function getRange(){
  client.lrange('city/channels/chat/messages',0,10,function(error, list){

  });
}

function initDate(channel){
  client.llen('city/channels/chat/messages',function(error, length){
    client.lrange('city/channels/chat/messages',length-20,length,function(error, list){
      bayeux.getClient().publish(channel, list);
    });
  });
}

bayeux.attach(server);
server.listen(8000);
//console.log("server started")
function send(channel, text){
  bayeux.getClient().publish(channel, {
     text:   text
  });
}

