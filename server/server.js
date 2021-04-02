/*************************************************
*                  WEB SERVER                    *
*************************************************/
"use strict";

const CONFIG = {
	'width': 1400,
	'height': 470,
}
let players = [];
let stars = [];
let starsGenerator; // interval to generate stars
let moveSpaceships; // interval to move players
let gameStarted = false; // to check if the game started
let activeAdmin = false; // to check when there is someone hosting the game

var http = require('http');
var url = require('url');
var fs = require('fs');

const Star = require('./Star');
const Spaceship = require('./Spaceship');
const User = require('./User');
const lib = require('./lib');

const FILE_TYPES = {
	html: "text/html",
	css: "text/css",
	js: "text/js",
	svg: "image/svg+xml",
	png: "image/png",
	gif: "image/gif",
	ico: "image/ico",
	jpg: "image/jpg",
	jpeg: "image/jpg",
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
		resposta.writeHead(404, { 'Content-Type': 'text/html' });
		resposta.end("404 Not Found");
		return;
	}

	resposta.writeHead(200, { 'Content-Type': cType });
	resposta.end(dades);
}

function header(resposta, codi, cType) {
	resposta.setHeader('Access-Control-Allow-Origin', '*');
	resposta.setHeader('Access-Control-Allow-Methods', 'GET');
	if (cType) resposta.writeHead(codi, { 'Content-Type': cType });
	else resposta.writeHead(codi);
}

function onRequest(peticio, resposta) {
	var cosPeticio = "";

	peticio.on('error', function (err) {
		console.error(err);
	}).on('data', function (dades) {
		cosPeticio += dades;
	}).on('end', function () {
		resposta.on('error', function (err) {
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
			if (cType) fs.readFile(filename, function (err, data) { enviarArxiu(err, data, resposta, cType); });
			else {
				resposta.writeHead(400, { 'Content-Type': 'text/html' });
				resposta.end("Tipus d'arxiu desconegut.");
			}
		}
	});
}

var server = http.createServer();
server.on('request', onRequest);
server.listen(8080);


/********************************************
 *             WEB SOCKET SERVER            *
 ********************************************/

const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8180 });

wss.on("connection", (client, petition) => {
	let user = new User(); // create a new user

	client.on("close", msg => {
		if (user.isAdmin) {
			endGame();
			user.close();
		} else {	
			user.close(players);
			
			broadcast(client, JSON.stringify({
				'msg': 'player_disconnected',
				'user': user
			}));
		}
	});

	client.on("message", msg => {
		process(client, msg, user);
	});
});


function process(client, msg, user) {
	msg = JSON.parse(msg);

	switch (msg.action) {
		case 'host_game':
			if (activeAdmin) {
				client.send(JSON.stringify({
					'msg': 'active_host'
				}));
			} else {
				lib.log('Administrator connected.');
				activeAdmin = true;
				user.isAdmin = true;
			}
			break;

		case 'play_game':
			if (!activeAdmin || gameStarted) {
				client.send(JSON.stringify({
					'msg': 'no_host_active'
				}));
			}
			break;

		case 'register_nickname':
			lib.log('Registering a nickname.');
			createPlayer(client, msg.nickname, user);
			break;

		case 'move_spaceship':
			moveSpaceship(user, msg.type, msg.keys);
			break;

		case 'start_game':
			startGame();
			break;

		case 'end_game':
			endGame();
			break;
	}
}

/**
 * Generate the spaceship for the user
 * Check if the nickname is available
 * If the nickname is already in use, send to the client the error
 * If the spaceship was generated successfully send to all players the list of players
 * @param {Object} client WebSocket client
 * @param {String} nickname 
 * @param {User} user 
 */
function createPlayer(client, nickname, user) {
	let found = false;
	// check nickname is available (not picked by another player)
	players.forEach(player => {
		if (player.nickname === nickname) {
			// send to client the nickname is not available
			client.send(JSON.stringify({ 'msg': 'duplicate_nickname' }));
			found = true;
			return;
		}
	});
	if (found) return;

	// set the nickname
	user.nickname = nickname;
	// create the spaceship for the user
	user.spaceship = new Spaceship();
	// add the user to the list of players
	players.push(user);
	// send to client it can continue with the nickname and send the game zone size
	client.send(JSON.stringify({
		'msg': 'ok',
		'config': CONFIG,
	}));

	let players_msg = JSON.stringify({
		'msg': 'add_players',
		'players': players,
	});

	// send to the new player the list of all players
	client.send(players_msg);

	// send to all players the updated list of players
	broadcast(client, players_msg);
}

/**
 * Generate stars (max of 10 stars) every 1.5 seconds
 * add them to the list and then send the new star to all the players.
 */
function generateStars() {
	starsGenerator = setInterval(() => {
		if (stars.length < 10) {
			// generate a new star and add it to the list
			let star = new Star();
			stars.push(star);

			// send to every player the new star
			broadcast(null, JSON.stringify({
				'msg': 'add_star',
				'star': star,
			}));
		}
	}, 1500);
}

function moveSpaceship(user, type, keys) {
	if (type === 'keydown') {
		if (keys.left_key) {
			user.moveX = -3;
		} else if (keys.right_key) {
			user.moveX = 3;
		}

		if (keys.up_key) {
			user.moveY = -3;
		} else if (keys.down_key) {
			user.moveY = 3;
		}
		// user.moveX = (keys.left_key && keys.right_key) ? 0 : keys.left_key ? -1 : keys.right_key ? 1 : 0;
		// user.moveY = (keys.up_key && keys.down_key) ? 0 : keys.up_key ? -1 : keys.down_key ? 1 : 0;
	} else if (type === 'keyup') {
		if (user.moveX === -3 && keys.left_key) {
			user.moveX = 0;
		} else if (user.moveX === 3 && keys.right_key) {
			user.moveX = 0;
		}

		if (user.moveY === -3 && keys.up_key) {
			user.moveY = 0;
		} else if (user.moveY === 3 && keys.down_key) {
			user.moveY = 0;
		}
	}
}

function movePlayers() {
	moveSpaceships = setInterval(() => {
		players.forEach(player => {
			player.spaceship.move(player.moveX, player.moveY);
		});

		// send to all players the updated coordinates of all players
		broadcast(null, JSON.stringify({
			'msg': 'move_spaceships',
			'players': players
		}));
	}, 10);
}

function startGame() {
	lib.log('Game has started.');
	gameStarted = true;
	generateStars(); // start generating stars
	movePlayers(); // start moving spaceships
	// send to all players that the game starts
	broadcast(null, JSON.stringify({
		'msg': 'start_game'
	}));
}

function endGame() {
	lib.log('Game has ended.');
	gameStarted = false;
	clearInterval(starsGenerator); // stop generating stars
	clearInterval(moveSpaceships); // stop moving spaceships

	// order the players by their score (number of stars)
	let playersByScore = orderPlayersByScore(players);

	// send to all players that the game has ended and the players ranking
	broadcast(null, JSON.stringify({
		'msg': 'end_game',
		'players': playersByScore
	}));
	
	stars = []; // clear stars list
	players = []; // clear the players list
}

/**
 * The function orders the array of players by Score DESC.
 * @param {Array} players 
 */
function orderPlayersByScore(players){
	if (players.length == 1) return players;
	else{
		players.sort(compareScore);
		return players;
	}
}

/**
 * Substract both scores and returns the result
 * @param {User} playerA 
 * @param {User} playerB 
 * @returns 
 */
function compareScore(playerA,playerB){
	return playerB.spaceship.score - playerA.spaceship.score;
}

function broadcast(client, message) {
	wss.clients.forEach(function each(cli) {
		if (cli !== client && cli.readyState === WebSocket.OPEN) {
			cli.send(message);
		}
	});
}

module.exports.config = CONFIG;
module.exports.stars = stars;
module.exports.broadcast = broadcast;