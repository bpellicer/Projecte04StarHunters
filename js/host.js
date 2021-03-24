'use strict';

let connection; // Web Socket connection

function init() {
	let domain = window.location.protocol === 'file:' ? 'localhost' : window.location.hostname;
	connection = new WebSocket(`ws://${domain}:8180`);

	connection.onopen = function (event) {
		connection.send(JSON.stringify({
			'msg': 'host_game',
		}))
	}

	connection.onmessage = function (event) {
		let data = JSON.parse(event.data); // cast data to json

		switch (data.msg) {
			case 'active_host':
				// go back to index.html
				break;

			case 'add_players':
				break;
		}
	}

	connection.onclose = function (event) {

	}

	connection.onclose = function (event) {

	}
}

function startGame() {
	connection.send(JSON.stringify({

	}))
}