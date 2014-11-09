var http = require('http'),
    faye = require('faye');

var server = http.createServer(),
    bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});

bayeux.on('handshake', function(clientId) {
   console.log("client connected: "+ clientId);
   //send("/chat","welcome");
});

bayeux.on('publish', function(clientId,channel,data) {
   console.log("a message incoming, from: "+ clientId+ "   channel:"+channel + "   data:" + data.text );
   //send("chat","welcome");
});

bayeux.attach(server);
server.listen(8000);

function send(channel, text){
  bayeux.getClient().publish(channel, {
     text:   text
  });
}

