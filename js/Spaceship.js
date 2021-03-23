'use strict';

class Spaceship {
	nickname;
	spaceship;
	xPos;
	yPos;
	coordinates;
	width;
	height;

	constructor(nickname) {
		this.nickname = nickname; // name of the player

		let path = 'images/icons/spaceship'; // root path of spaceship image

		// set specific image if is the local player
		if (NICKNAME === this.nickname) {
			path+= '_red';
		}

		path += '.png'; // add image extension

		// create the image element, set attributes and append to game zone
		this.spaceship = $('<img>')
			.attr('id', this.nickname)
			.attr('alt', '8 bits spaceship')
			.attr('src', path)
			.addClass('spaceship')
			.appendTo(GAME_ZONE);

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
		this.width = Number(this.spaceship.css('width').replace('px', ''));
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
		this.checkImpact();
	}

	/**
	 * Check if has impacted one of the stars
	 */
	checkImpact() {
		function isOverlap(objOne, objTwo) {
			let offsetOne = objOne.offset(),
				offsetTwo = objTwo.offset(),
				topOne = offsetOne.top,
				topTwo = offsetTwo.top,
				leftOne = offsetOne.left,
				leftTwo = offsetTwo.left,
				widthOne = objOne.width() - 20,
				widthTwo = objTwo.width() - 20,
				heightOne = objOne.height() - 20,
				heightTwo = objTwo.height() - 20;

			let leftTop = leftTwo > leftOne && leftTwo < leftOne + widthOne && topTwo > topOne && topTwo < topOne + heightOne,
				rightTop = leftTwo + widthTwo > leftOne && leftTwo + widthTwo < leftOne + widthOne && topTwo > topOne && topTwo < topOne + heightOne,
				leftBottom = leftTwo > leftOne && leftTwo < leftOne + widthOne && topTwo + heightTwo > topOne && topTwo + heightTwo < topOne + heightOne,
				rightBottom = leftTwo + widthTwo > leftOne && leftTwo + widthTwo < leftOne + widthOne && topTwo + heightTwo > topOne && topTwo + heightTwo < topOne + heightOne;

			return leftTop || rightTop || leftBottom || rightBottom;
		}

		// check for every star if the spaceship is overlapping
		stars.forEach(star => {
			if (isOverlap(star.star, this.spaceship)) {
				star.destroy();
			}
		});
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