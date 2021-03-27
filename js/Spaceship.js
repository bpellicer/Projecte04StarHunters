'use strict';

class Spaceship {
	nickname;
	spaceship;
	width;
	height;

	constructor(nickname) {
		this.nickname = nickname; // name of the player

		let path = 'images/icons/spaceship'; // root path of spaceship image

		// set specific image if is the local player
		if (NICKNAME === this.nickname) {
			path += '_red';
		}

		path += '.png'; // add image extension

		// create the image element, set attributes and append to game zone
		this.spaceship = $('<img>')
			.attr('id', this.nickname)
			.attr('alt', '8 bits spaceship')
			.attr('src', path)
			.addClass('spaceship')
			.appendTo(GAME_ZONE);
		
		this.width = 88;
		this.height = 88;

		// move the spaceship in the center of the game zone
		this.move((WIDTH / 2 - this.width / 2), (HEIGHT / 2 - this.height / 2));
	}

	move(x, y) {
		// move the spaceship to the coordinates
		$(this.spaceship).css({
			'left': `${x}px`,
			'top': `${y}px`
		});
	}
}