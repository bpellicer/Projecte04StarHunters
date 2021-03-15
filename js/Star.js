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
	}

}