'use strict';

const DIV_FORM = $("#nickname-form");
const GAME = $("#game");
const GAME_ZONE = $('#game-zone');
const SCORE_LIST = $('#score-list');
let WIDTH; // width of the game zone set by the server
let HEIGHT; // height of the game zone set by the server

let NICKNAME; // nickname from local player

let stars = [];
let spaceships = [];

/**
 * Listen for 'keydown' and 'keyup' events on document to move the spaceship
 */
function moveKeys() {
	$(document).on('keydown keyup', e => {
		const LEFT_KEY = e.key === 'a' || e.code === 'KeyA' || e.keyCode === 65;
		const RIGHT_KEY = e.key === 'd' || e.code === 'KeyD' || e.keyCode === 68;
		const UP_KEY = e.key === 'w' || e.code === 'KeyW' || e.keyCode === 87;
		const DOWN_KEY = e.key === 's' || e.code === 'KeyS' || e.keyCode === 83;

		if (LEFT_KEY || RIGHT_KEY || UP_KEY || DOWN_KEY) {
			connection.send(JSON.stringify({
				'action': 'move_spaceship',
				'type': e.type,
				'keys': {
					'left_key': LEFT_KEY,
					'right_key': RIGHT_KEY,
					'up_key': UP_KEY,
					'down_key': DOWN_KEY,
				}
			}));
		}

		// animate keys when they are pressed and stop being pressed
		if (e.type === 'keydown') {
			if (LEFT_KEY) {
				$('.a').addClass('press');
			} else if (RIGHT_KEY) {
				$(".d").addClass('press');
			}

			if (UP_KEY) {
				$(".w").addClass('press');
			} else if (DOWN_KEY) {
				$(".s").addClass('press');
			}

		} else if (e.type === 'keyup') {
			if (LEFT_KEY) {
				$('.a').removeClass('press');
			} else if (RIGHT_KEY) {
				$(".d").removeClass('press');
			}

			if (UP_KEY) {
				$('.w').removeClass('press');
			} else if (DOWN_KEY) {
				$(".s").removeClass('press');
			}
		}
	});
}

function addPlayers(players) {
	// for each player create a new spaceship if was not created before
	players.forEach(player => {
		// prevent creating a second spaceship for the local player
		// if (player.nickname === NICKNAME) return;

		let found = false;
		spaceships.forEach(spaceship => {
			if (spaceship.nickname === player.nickname) {
				found = true;
				return;
			}
		})

		if (!found) {
			spaceships.push(new Spaceship(player.nickname));
		}
	});
}

/**
 * Remove a spaceship from the game zone and from the spaceships list
 * @param {User} user User class from server
 */
function removePlayer(user) {
	spaceships.forEach((spaceship, pos) => {
		if (spaceship.nickname === user.nickname) {
			spaceship.spaceship.remove();
			spaceships.splice(pos, 1);
			return;
		}
	});
}

function movePlayers(players) {
	players.forEach(p => {
		spaceships.forEach(s => {
			if (p.nickname === s.nickname) {
				s.move(p.spaceship.xPos, p.spaceship.yPos);
			}
		});
	});
}

/**
 * Generate a new star and add it to the list of stars
 * @param {Star} star Star class from server
 */
function addStar(star) {
	// generate the new star and add it to the list of stars
	stars.push(new Star(star.id, star.xPos, star.yPos));
}

/**
 * Remove a star from the game zone and from the list of stars
 * @param {Object} star 
 */
function removeStar(star) {
	stars.forEach(function (s, pos) {
		if (star.id === s.id) {
			s.star.remove(); // remove the element from the game zone
			stars.splice(pos, 1); // remove from the list
		}
	});
}

function startGame() {
	$('#pregame-message').hide();
	moveKeys();
}

function endGame() {
	// stop listening for keydown and keyup events on document
	$(document).off('keydown keyup');
	// clearInterval(moveSpaceship);
	// remove all stars from the game zone
	// stars.forEach(star => {
	// 	star.star.remove();
	// });
	// // remove all spaceships from the game zone
	// spaceships.forEach(spaceship => {
	// 	spaceship.spaceship.remove();
	// });

	// spaceships = []; // clear spaceships
	// stars = [];	// clear stars list
}

/**
 * Add each player setting the nickname and score in a list
 * @param {Array} players list of players ordered by score
 */
function generateScoreList(players) {
	const LIST = $('#player-list');
	// const STAR = $('<img>').addClass('star').attr('src', 'images/icons/star.png').attr('alt', '8 bits star');
	const STAR = `<img class="star" src="images/icons/star.png" alt="8 bits star"`;

	players.forEach(player => {
		// LIST.append(
		// 	$('<li>')
		// 		.addClass('player')
		// 		.append($('<span>').addClass('nickname').text(player.nickname))
		// 		.append($('<span>').addClass('score').text(player.score).append(STAR))
		// );
		let li = `<li class="player"><span class="nickname">${player.nickname}</span><span class="score">${player.spaceship.score}${STAR}</span></li>`;
		LIST.append(li);
	});

	// show the list
	SCORE_LIST.show();
}

function init() {
	GAME.hide();
	SCORE_LIST.hide();
}

$(document).ready(function () {
	init();
});