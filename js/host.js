'use strict';

let connection; // Web Socket connection
let players = [];

function init() {
	let domain = window.location.protocol === 'file:' ? 'localhost' : window.location.hostname;
	connection = new WebSocket(`ws://${domain}:8180`);

	connection.onopen = function (event) {
		connection.send(JSON.stringify({
			'action': 'host_game',
		}));
	}

	connection.onmessage = function (event) {
		let data = JSON.parse(event.data); // cast data to json

		switch (data.msg) {
			case 'active_host':
				// go back to index.html
				window.location.replace("index.html");
				break;

			case 'add_players':
				addPlayers(data.players);
				break;
		}
	}

	connection.onclose = function (event) {

	}

	connection.onclose = function (event) {

	}
}


function addPlayers(users){
	// for each player create a new spaceship if was not created before
	users.forEach(user => {
		
		let found = false;
		players.forEach(player => {
			if (player.nickname === user.nickname) {
				found = true;
				return;
			}
		});
		if (!found) {
			players.push(user);
			$('#players-list').append(
				$('<div>')
					.attr('id', user.nickname)
					.addClass('player')
					.text(user.nickname)
			);
		}
	});
	
}

function startGame() {
	connection.send(JSON.stringify({

	}))
}

$(document).ready(function () {
	init();
});