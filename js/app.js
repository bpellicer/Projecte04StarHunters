'use strict';

const GAME_ZONE = $('#game-zone');
const GAME = $("#game");
const DIV_FORM = $("#nickname-form");
let WIDTH; // width of the game zone set by the server
let HEIGHT; // height of the game zone set by the server

let NICKNAME; // nickname from local player
let spaceship;

let stars = [];
let spaceships = [];
let endGame = false;

let moveXAxis; // interval to move in 'x' axis
let moveYAxis; // interval to move in 'y' axis

/**
 * Listen for 'keydown' and 'keyup' events on document to move the spaceship
 */
function moveKeys() {
	$(document).on('keydown keyup', e => {
		const LEFT_KEY = e.key === 'a' || e.code === 'KeyA' || e.keyCode === 65;
		const RIGHT_KEY = e.key === 'd' || e.code === 'KeyD' || e.keyCode === 68;
		const UP_KEY = e.key === 'w' || e.code === 'KeyW' || e.keyCode === 87;
		const DOWN_KEY = e.key === 's' || e.code === 'KeyS' || e.keyCode === 83;

		if (e.type === 'keydown') {
			if (LEFT_KEY || RIGHT_KEY) {
				//if is moving, leave
				if (moveXAxis) return;
				// check in which direction to move
				let x = LEFT_KEY ? -1 : RIGHT_KEY ? 1 : 0;

				LEFT_KEY ? $('.a').addClass('press') : null;
				RIGHT_KEY ? $(".d").addClass('press') : null;

				// start moving
				moveXAxis = setInterval(() => {
					spaceship.move(x, 0);
				}, 5);
			} else if (UP_KEY || DOWN_KEY) {
				// if is moving, leave
				if (moveYAxis) return;
				// check in which direction move
				let y = UP_KEY ? -1 : DOWN_KEY ? 1 : 0;

				UP_KEY ? $(".w").addClass('press') : null;
				DOWN_KEY ? $(".s").addClass('press') : null;

				// start moving
				moveYAxis = setInterval(() => {
					spaceship.move(0, y);
				}, 5);
			}
		} else if (e.type === 'keyup') {
			if (LEFT_KEY || RIGHT_KEY) {

				LEFT_KEY ? $('.a').removeClass('press') : null;
				RIGHT_KEY ? $(".d").removeClass('press') : null;
								
				clearInterval(moveXAxis);
				moveXAxis = null;
			} else if (UP_KEY || DOWN_KEY) {

				UP_KEY ? $('.w').removeClass('press') : null;
				DOWN_KEY ? $(".s").removeClass('press') : null;

				clearInterval(moveYAxis);
				moveYAxis = null;
			}
		}
	});
}

function addPlayers(players) {
	// for each player create a new spaceship if was not created before
	players.forEach(player => {
		// prevent creating a second spaceship for the local player
		if (player.nickname === NICKNAME) return;

		let found = false;
		spaceships.forEach(spaceship => {
			if (spaceship.nickname === player.nickname) {
				found = true;
				return;
			}
		})

		if (!found) {
			spaceships.push(new Spaceship(player.nickname));
		}
	});

	console.log(spaceships);
}

/**
 * Remove a spaceship from the game zone and from the spaceships list
 * @param {Object} user 
 */
function removePlayer(user) {
	spaceships.forEach((spaceship, pos) => {
		if (spaceship.nickname === user.nickname) {
			spaceship.spaceship.remove();
			spaceships.splice(pos, 1);
			return;
		}
	});
}

function init() {
	GAME.hide();
}

$(document).ready(function () {
	init();
});