'use strict';

class Spaceship {
	constructor(id) {
		this.id = id; // name of the player
		this.spaceship = $(`#${id}`);

		this.xPos = 0;
		this.yPos = 0;

		this.moveLeft = false;
		this.moveRight = false;
		this.moveUp = false;
		this.moveDown = false;

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
	}
}