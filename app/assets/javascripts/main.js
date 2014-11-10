var client = new Faye.Client('http://localhost:8000/faye');

var subscription = client.subscribe('/chat', function(message) {
   console.log(message.text);
});



client.addExtension({
	outgoing: function(message, callback) {
	  if (message.channel === '/meta/connect') {
	    //transport.innerHTML = message.connectionType;
	    //console.log(JSON.stringify(message));
	  }
	  
	  //callback(message);
	}
});


client.connect(function(data){
	//console.log(JSON.stringify(data));
	console.log("connected: "+client._clientId);
    var subscriptionInit = client.subscribe('/'+client._clientId, function(message) {
	   console.log(message.text);
	});
	

},this)
//client.publish('/chat', {id:1, name:"haha", avatar:"http://home/aa.jpg", text: 'Hi there'});