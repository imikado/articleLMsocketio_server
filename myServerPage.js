var io = require('socket.io')(8080);

var clientId=1;
var tClient=Array();
var tName=Array();

io.on('connection', function (socket) {
  socket.emit('bienvenue', { message: 'Bienvenue id:'+clientId });
  tClient[socket.id]=clientId;
  clientId++;

  socket.on('demanderConnexion',function(data){
   tName[socket.id]=data.nom;

   socket.emit('demarrerMessagerie',{nom:data.nom});
	
   var myMessage={message: data.nom+' vient de se connecter',sender:'Serveur'};
   socket.broadcast.emit('message',myMessage);
   socket.emit('message',myMessage);
  });

  socket.on('message', function (data) {
    var mySender=tName[socket.id];

    var newMessageAll={message:data.message,for:'all',sender:mySender};
    var newMessageSender={message:data.message,for:'sender',sender:mySender};

    socket.broadcast.emit('message',newMessageAll);
    socket.emit('message',newMessageSender);

    console.log(data);
  });
});
