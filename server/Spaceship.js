'use strict';

let server = require('./server');
let Star = require('./Star');

class Spaceship {
	width;
	height;
	xPos;
	yPos;
	score = 0;
	
	constructor() {
		this.width = 88;
		this.height = 88;

		this.xPos = server.config.width / 2 - this.width / 2;
		this.yPos = server.config.height / 2 - this.height / 2;
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
		if (this.yPos < 0 || this.xPos < 0 || (this.yPos + this.height) > server.config.height || (this.xPos + this.width) > server.config.width) {
			this.xPos -= x;
			this.yPos -= y;
			return;
		}

		this.checkImpact();
	}

	/**
	 * Check if has impacted one of the stars
	 */
	 checkImpact() {
		function isOverlap(objOne, objTwo) {
			let topOne = objOne.yPos,
				topTwo = objTwo.yPos,
				leftOne = objOne.xPos,
				leftTwo = objTwo.xPos,
				widthOne = objOne.width - 20,
				widthTwo = objTwo.width - 20,
				heightOne = objOne.height - 20,
				heightTwo = objTwo.height - 20;

			let leftTop = ((leftTwo > leftOne) && (leftTwo < (leftOne + widthOne)) &&( topTwo > topOne) && (topTwo < (topOne + heightOne))),
				rightTop = (((leftTwo + widthTwo) > leftOne) && (leftTwo + widthTwo) < (leftOne + widthOne) && (topTwo > topOne) && (topTwo < (topOne + heightOne))),
				leftBottom = ((leftTwo > leftOne) && (leftTwo < (leftOne + widthOne)) && ((topTwo + heightTwo) > topOne) && ((topTwo + heightTwo) < (topOne + heightOne))),
				rightBottom = ((leftTwo + widthTwo) > leftOne) && ((leftTwo + widthTwo) < (leftOne + widthOne)) && ((topTwo + heightTwo) > topOne) && ((topTwo + heightTwo) < (topOne + heightOne));

			return leftTop || rightTop || leftBottom || rightBottom;
		}

		// check for every star if the spaceship is overlapping
		server.stars.forEach(star => {
			if (isOverlap(this, star)) {
				star.destroy();
				this.score++;
			}
		});
	}
}

module.exports = Spaceship;