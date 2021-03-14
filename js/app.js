'use strict';

const GAME_ZONE = $('#game-zone');
const WIDTH = GAME_ZONE.width(); // width of the game zone
const HEIGHT = GAME_ZONE.height(); // height of the game zone

let stars;
let endGame = false;

let spaceship = new Spaceship('player-spaceship');