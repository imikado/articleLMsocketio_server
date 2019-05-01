var io = require('socket.io')(8080);

var tableauDesNoms=Array();

io.on('connection', function (socket) {
	socket.emit('bienvenue', { message: 'Bienvenue' });

	//definition de l'evenement de demande de connexion (qui contiendra le nom de l'utilisateur)
	socket.on('demanderConnexion',function(messageRecu){
		
		//on stocke les noms des utilisateurs avec leur identifiant de socket
		tableauDesNoms[socket.id]=messageRecu.nom;

		//on envoi un evenement a l'utilisateur pour demarrer l'application
		socket.emit('demarrerMessagerie',{nom:messageRecu.nom});
		
		//message pour indiquer un nouvel arrivant
		var messageAenvoyer={message: messageRecu.nom+' vient de se connecter',auteur:'Serveur'};
		
		//envoi du message aux autres internautes
		socket.broadcast.emit('message',messageAenvoyer);
		//envoi a l'utilisateur emetteur de l'evenement
		socket.emit('message',messageAenvoyer);
		
	});

	socket.on('message', function (messageRecu) {
		//on recupere le nom de l'utilisateur
		var auteurDuMessage=tableauDesNoms[socket.id];

		//on differencie le message de l'emetteur et celui des autres utilisateur
		var messageAenvoyerAuxAutres={message:messageRecu.message,auteur:auteurDuMessage};
		var messageAenvoyerAlEmetteur={message:messageRecu.message,auteur:'Moi'};

		socket.broadcast.emit('message',messageAenvoyerAuxAutres);
		socket.emit('message',messageAenvoyerAlEmetteur);

		console.log(messageRecu);
	});
});
