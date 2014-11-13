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
   send(channel,"welcome haha");
   //send("/chat","welcome");
});

bayeux.on('subscribe', function(clientId,channel) {
   isPrivate = /\/channels\/\d+/.test(channel);
   console.log("not private"+channel)
   if(isPrivate){
      console.log("private");
      send(channel,"welcome haha");
   }

   //send("/chat","welcome");
});

bayeux.on('publish', function(clientId,channel,data) {
   console.log("a message incoming, from: "+ clientId + "   channel:"+channel + "   data:" + data.text );
   client.rpush('city/channels/chat/messages', JSON.stringify(data));
   //send("chat","welcome");
});

bayeux.attach(server);
server.listen(8000);
//console.log("server started")
function send(channel, text){
  bayeux.getClient().publish(channel, {
     text:   text
  });
}

