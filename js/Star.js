'use strict';

class Star {
	constructor() {
		/**
		 * Generate a random number between 'min' and 'max' both included
		 * @param {Number} min 
		 * @param {Number} max 
		 */
		let randNum = (min, max) => {
			return Math.random() * (max - min) + min;
		}
		
		// generate x and y random axis
		this.xPos = randNum(0, WIDTH - 64);
		this.yPos = randNum(0, HEIGHT - 64);

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

		this.width = 64;
		this.height = 64;

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

}