'use strict';

class Spaceship {
	constructor(nickname) {
		this.nickname = nickname; // name of the player
		this.spaceship = $(`#${nickname}`);

		this.xPos = 0;
		this.yPos = 0;

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

		// get the css value of width and height, remove the 'px'
		this.width = Number(this.spaceship.css('width').replace('px',''));
		this.height = Number(this.spaceship.css('height').replace('px', ''));

		// move the spaceship in the center of the game zone
		this.move((WIDTH / 2 - this.width / 2), (HEIGHT / 2 - this.height / 2));
	}

	/**
	 * Move the spaceship
	 * @param {Number} x Number of pixels to move in X axis (vertically)
	 * @param {Number} y Number of pixels to move in Y axis (vertically)
	 */
	move(x, y) {
		this.xPos += x;
		this.yPos += y;

		// check if the new position is outside of the game zone limits
		// 'yPos' is negative: tried going out of top side
		// 'xPos' is negative: tried going out of left side
		// 'yPos' + height of spaceship is bigger than the height of the zone: tried going out of right side
		// 'xPos' + width of spaceship is bigger than the width of the zone: tried going out down side
		if (this.yPos < 0 || this.xPos < 0 || (this.yPos + this.height) > HEIGHT || (this.xPos + this.width) > WIDTH) {
			this.xPos -= x;
			this.yPos -= y;
			throw new Error('Spaceship going out of limits!');
		}

		// move the spaceship
		$(this.spaceship).css({
			'left': `${this.xPos}px`,
			'top': `${this.yPos}px`
		});

		this.calcCoordinates();
	}

	/**
	 * Recalculate the coordinates of the 4 vertex of the star
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