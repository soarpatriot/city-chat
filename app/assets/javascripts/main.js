var client = new Faye.Client('http://localhost:8000/faye');

var subscription = client.subscribe('/chat', function(message) {
   console.log(message.text);
});

client.connect(function(){
	console.log("connected")
},this)
client.publish('/chat', {id:1, name:"haha", avatar:"http://home/aa.jpg", text: 'Hi there'});