/*************************************************
*                  WEB SERVER                    *
*************************************************/
"use strict";

const WIDTH = 1500;
const HEIGHT = 660;

var http = require('http');
var url = require('url');
var fs = require('fs');


const FILE_TYPES = {
	html:"text/html",
	css:"text/css",
	js:"text/js",
	svg:"image/svg+xml",
	png:"image/png",
	gif:"image/gif",
	ico:"image/ico",
	jpg:"image/jpg",
	jpeg:"image/jpg",
};

// Obté el tipus de contingut a partir de l'extensió de l'arxiu
function contentType(filename) {
	var ext = filename.split('.').pop();

	if (ext in FILE_TYPES) return FILE_TYPES[ext];
	else return undefined;
}

// Envia l'arxiu o respon amb un error si no el troba o no el pot llegir
function enviarArxiu(err, dades, resposta, cType) {
	if (err) {
		resposta.writeHead(404, {'Content-Type': 'text/html'});
		resposta.end("404 Not Found");
		return;
	}

	resposta.writeHead(200, {'Content-Type': cType});
	resposta.end(dades);
}

function header(resposta, codi, cType) {
	resposta.setHeader('Access-Control-Allow-Origin', '*');
	resposta.setHeader('Access-Control-Allow-Methods', 'GET');
	if (cType) resposta.writeHead(codi, {'Content-Type': cType});
	else resposta.writeHead(codi);
}

function onRequest(peticio, resposta) {
	var cosPeticio = "";

	peticio.on('error', function(err) {
		console.error(err);
	}).on('data', function(dades) {
		cosPeticio += dades;
	}).on('end', function() {
		resposta.on('error', function(err) {
			console.error(err);
		});

		if (peticio.method == 'GET') {
			// Amb true retorna un objecte amb els paràmetres passats:
			//	?p1=hola --> { p1: 'hola' }
			// Sense true retorna l'string: "?p1=hola"
			dades = url.parse(peticio.url, true);
			
			var filename = "." + dades.pathname;
			if (filename == "./") filename += "index.html";
			
			var cType = contentType(filename);
			if (cType) fs.readFile(filename, function(err, data) { enviarArxiu(err, data, resposta, cType); });
			else {
				resposta.writeHead(400, {'Content-Type': 'text/html'});
				resposta.end("Tipus d'arxiu desconegut.");
			}
		}
	});
}

var players = [];

var server = http.createServer();
server.on('request', onRequest);
server.listen(8080);


/********************************************
 *             WEB SOCKET SERVER            *
 ********************************************/

const WebSocket = require("ws");

const wss = new WebSocket.Server({port: 8180});

wss.on("connection", (client, petition) => {
	let user = new User(); // create a new user
    
	client.on("close", msg => {
		user.close();
    });

    client.on("message", msg => {
        log('Message from user' +user.id);
		process(client, msg, user);
    })
});


function process(client, msg, user) {
	msg = JSON.parse(msg);

	switch (msg.action){
		case 'newUser':
			log('User '+ id +' creating ');
			createPlayer(client, msg.nickname, user);
			break;

		case 'move':
			// move player
			break;

		case 'impact':
			// player impacted a star
			break;
	}
}


function createPlayer(client, nickname, user) {
	// check nickname is available (not picked by another player)
	players.forEach(player => {
		if (player.nickname === nickname) {
			// send to client the nickname is not available
			client.send({'message': 'duplicate'});
			return false;
		}
	});

	// create a new player (spaceship) and add it to the list of players
	user.spaceship = new Spaceship(nickname);
	players.push(user.spaceship);
	
	// send to client it can continue with the nickname and send the game zone size
	client.send(JSON.stringify({
		'message':"ok",
		'width': WIDTH,
		'height': HEIGHT
	}));
}

function log(data) {
	console.log(`[${new Date().toLocaleString()}] ${data}`);
}