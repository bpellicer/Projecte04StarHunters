'use strict';

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
		return ++ini;
	}
	return increment;
}

class Star {
	static counter = counter();

	constructor() {
		this.id = Star.counter();

		// generate x and y random axis
		this.xPos = randNum(0, WIDTH - 64);
		this.yPos = randNum(0, HEIGHT - 64);
	}
}