'use strict';

const GAME_ZONE = $('#game-zone');
const WIDTH = GAME_ZONE.width(); // width of the game zone
const HEIGHT = GAME_ZONE.height(); // height of the game zone

let stars = [];
let endGame = false;

let spaceship = new Spaceship('player-spaceship');

let generateStars = setInterval(() => {
	// check how many stars there are
	// it only can be 10 stars in game zone
	if (stars.length === 10) return;
	stars.push(new Star()); // add the star to the list
}, 1000 * 1.5);