'use strict';

const DIV_FORM = $("#nickname-form");
const GAME = $("#game");
const GAME_ZONE = $('#game-zone');
const SCORE_LIST = $('#score-list');
let WIDTH; // width of the game zone set by the server
let HEIGHT; // height of the game zone set by the server

let NICKNAME; // nickname from local player
let spaceship; // spaceship from the local player

let stars = [];
let spaceships = [];

let moveXAxis; // interval to move in 'x' axis
let moveYAxis; // interval to move in 'y' axis

/**
 * Listen for 'keydown' and 'keyup' events on document to move the spaceship
 */
function moveKeys() {
	$(document).on('keydown keyup', e => {
		const LEFT_KEY = e.key === 'a' || e.code === 'KeyA' || e.keyCode === 65;
		const RIGHT_KEY = e.key === 'd' || e.code === 'KeyD' || e.keyCode === 68;
		const UP_KEY = e.key === 'w' || e.code === 'KeyW' || e.keyCode === 87;
		const DOWN_KEY = e.key === 's' || e.code === 'KeyS' || e.keyCode === 83;

		if (e.type === 'keydown') {
			if (LEFT_KEY || RIGHT_KEY) {
				//if is moving, leave
				if (moveXAxis) return;
				// check in which direction to move
				let x = LEFT_KEY ? -1 : RIGHT_KEY ? 1 : 0;

				LEFT_KEY ? $('.a').addClass('press') : null;
				RIGHT_KEY ? $(".d").addClass('press') : null;

				// start moving
				spaceship.moveXAxis(x);
			} else if (UP_KEY || DOWN_KEY) {
				// if is moving, leave
				if (moveYAxis) return;
				// check in which direction move
				let y = UP_KEY ? -1 : DOWN_KEY ? 1 : 0;

				UP_KEY ? $(".w").addClass('press') : null;
				DOWN_KEY ? $(".s").addClass('press') : null;

				// start moving
				spaceship.moveYAxis(y);
			}
		} else if (e.type === 'keyup') {
			if (LEFT_KEY || RIGHT_KEY) {

				LEFT_KEY ? $('.a').removeClass('press') : null;
				RIGHT_KEY ? $(".d").removeClass('press') : null;

				clearInterval(moveXAxis);
				moveXAxis = null;
			} else if (UP_KEY || DOWN_KEY) {

				UP_KEY ? $('.w').removeClass('press') : null;
				DOWN_KEY ? $(".s").removeClass('press') : null;

				clearInterval(moveYAxis);
				moveYAxis = null;
			}
		}
	});
}

function addPlayers(players) {
	// for each player create a new spaceship if was not created before
	players.forEach(player => {
		// prevent creating a second spaceship for the local player
		if (player.nickname === NICKNAME) return;

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
		let li = `<li class="player"><span class="nickname">${player.nickname}</span><span class="score">${player.score}${STAR}</span></li>`;
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