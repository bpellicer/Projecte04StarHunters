'use strict';

let server = require('./server');

/**
 * Generate a random number between 'min' and 'max' both included
 * @param {Number} min 
 * @param {Number} max 
 */
let randNum = (min, max) => {
	return Math.random() * (max - min) + min;
}

/**
 * Autoincrement id
 * @returns {Number}
 */
function counter() {
	let ini;
	if (!ini) ini = 1;
	let increment = () => {
		return ini++;
	}
	return increment;
}

class Star {
	static counter = counter();
	id;
	xPos;
	yPos;

	constructor() {
		this.id = Star.counter();

		// generate x and y random axis
		this.xPos = randNum(0, server.config.width - 64);
		this.yPos = randNum(0, server.config.height - 64);
	}

	destroy() {
		let id = this.id; // get the id

		server.stars.forEach(function (star, pos) {
			if (star.id === id) {
				server.stars.splice(pos, 1);
			}
		});

		// send to the server
		server.broadcast(null, JSON.stringify({
			'msg': 'remove_star',
			'star': this
		}));
	}
}

module.exports = Star;