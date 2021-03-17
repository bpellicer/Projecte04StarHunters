'use strict';

/**
 *  * Generate a random number between 'min' and 'max' both included
 *  * @param {Number} min 
 *  * @param {Number} max 
 *  */
let randNum = (min, max) => {
	return Math.random() * (max - min) + min;
}

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

		this.width = 64;
		this.height = 64;

		// generate x and y random axis
		this.xPos = randNum(0, WIDTH - this.width);
		this.yPos = randNum(0, HEIGHT - this.height);

		this.coordinates = {
			'topLeft': {
				'x': 0,
				'y': 0,
			},
			'bottomLeft': {
				'x': 0,
				'y': 0,
			},
			'topRight': {
				'x': 0,
				'y': 0,
			},
			'bottomRight': {
				'x': 0,
				'y': 0,
			},
		}

		// create the star image element, set it up and append to game zone
		this.star = $('<img>')
			.attr('alt', '8 bits star')
			.attr('src', 'images/icons/star.png')
			.addClass('star')
			.css({
				'left': `${this.xPos}px`,
				'top': `${this.yPos}px`
			})
			.appendTo(GAME_ZONE);

		this.calcCoordinates();
	}

	/**
	 * Recalculate the coordinates of the 4 vertex of the spaceship
	 */
	calcCoordinates() {
		// Top Left coordinates
		this.coordinates.topLeft.y = this.yPos;
		this.coordinates.topLeft.x = this.xPos;
		// Bottom Left coordinates
		this.coordinates.bottomLeft.x = this.xPos;
		this.coordinates.bottomLeft.y = this.yPos + this.height;
		// Top Right coordinates
		this.coordinates.topRight.x = this.xPos + this.width;
		this.coordinates.topRight.y = this.yPos;
		// Bottom Right coordinates
		this.coordinates.bottomRight.x = this.xPos + this.width;
		this.coordinates.bottomRight.y = this.yPos + this.height;
	}

	/**
	 * Remove star from the game zone and from the list of stars
	 */
	destroy() {
		this.star.remove(); // remove image from game zone

		let id = this.id; // get the id

		stars.forEach(function (star, pos) {
			if (star.id === id) {
				stars.splice(pos, 1);
			}
		});
	}

}