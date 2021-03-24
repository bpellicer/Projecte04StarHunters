'use strict';

const START_BTN = $('#start-btn');
const END_BTN = $('#end-btn');

let connection; // Web Socket connection
let players = [];

function init() {
	$(END_BTN).hide();

	$(START_BTN).click(event => {
		startGame();
		// hide the start button and show the end button
		$(START_BTN).hide();
		$(END_BTN).show();
	});

	$(END_BTN).click(event => {
		endGame();
		// hide the end button and show the start button
		$(END_BTN).hide();
		$(START_BTN).show();
	});

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
		//
	}

	connection.onerror = function (event) {
		//
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
		'action': 'start_game'
	}));
}

function endGame() {
	connection.send(JSON.stringify({
		'action': 'end_game'
	}));
}

$(document).ready(function () {
	init();
});