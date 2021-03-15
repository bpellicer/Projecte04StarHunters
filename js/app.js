'use strict';

const GAME_ZONE = $('#game-zone');
const WIDTH = GAME_ZONE.width(); // width of the game zone
const HEIGHT = GAME_ZONE.height(); // height of the game zone

let stars = [];
let endGame = false;

let moveXAxis; // interval to move in 'x' axis
let moveYAxis; // interval to move in 'y' axis

let spaceship = new Spaceship('player-spaceship');

let generateStars = setInterval(() => {
	// check how many stars there are
	// it only can be 10 stars in game zone
	if (stars.length === 10) return;
	stars.push(new Star()); // add the star to the list
}, 1000 * 1.5);

/**
 * Listen for 'keydown' and 'keyup' events on document to move the spaceship
 */
function keyEvents() {
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
				// start moving
				moveXAxis = setInterval(() => {
					spaceship.move(x, 0);
				}, 5);
			} else if (UP_KEY || DOWN_KEY) {
				// if is moving, leave
				if (moveYAxis) return;
				// check in which direction move
				let y = UP_KEY ? -1 : DOWN_KEY ? 1 : 0;
				// start moving
				moveYAxis = setInterval(() => {
					spaceship.move(0, y);
				}, 5);
			}
		} else if (e.type === 'keyup') {
			if (LEFT_KEY || RIGHT_KEY) {
				clearInterval(moveXAxis);
				moveXAxis = null;
			} else if (UP_KEY || DOWN_KEY) {
				clearInterval(moveYAxis);
				moveYAxis = null;
			}
		}
	});
}

function init() {
	keyEvents();
}

$(document).ready(function () {
	init();
});