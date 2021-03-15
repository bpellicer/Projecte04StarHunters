'use strict';

const GAME_ZONE = $('#game-zone');
const WIDTH = GAME_ZONE.width(); // width of the game zone
const HEIGHT = GAME_ZONE.height(); // height of the game zone

let stars = [];
let endGame = false;

let spaceship = new Spaceship('player-spaceship');

let generateStars = setInterval(() => {
	// check how many stars there are
	// it only can be 10 stars in game zone
	if (stars.length === 10) return;
	stars.push(new Star()); // add the star to the list
}, 1000 * 1.5);


function keyDownEvents(){
    document.addEventListener('keydown',(event) => {
        const keyName = event.key;
        switch(keyName.toLowerCase()){
            case "arrowleft": case "a":
                spaceship.moveLeft=true;
            break;
            case "arrowright": case "d":
                spaceship.moveRight = true;
            break;
            case "arrowdown": case "s":
                spaceship.moveDown = true;
            break;
            case "arrowup": case "w":
                spaceship.moveUp = true;
            break;
        }
    },false);
}

function keyUpEvents(){
    document.addEventListener('keyup',(event) => {
        const keyName = event.key;
        switch(keyName.toLowerCase()){
            case "arrowleft": case "a":
                spaceship.moveLeft=false;
            break;
            case "arrowright": case "d":
                spaceship.moveRight = false;
            break;
            case "arrowdown": case "s":
                spaceship.moveDown = false;
            break;
            case "arrowup": case "w":
                spaceship.moveUp= false;
            break;
        }
    },false);   
}

function checkKeys(){
    if((spaceship.moveLeft === true && spaceship.moveRight === true) || (spaceship.moveUp === true && spaceship.moveDown === true)){
		spaceship.move(spaceship.xPos,spaceship.yPos);
	}
	else if(spaceship.moveLeft === true  && spaceship.moveUp == false){
		if(spaceship.xPos>=22)spaceship.move(spaceship.xPos-1,spaceship.yPos);
	}
    /*
	else if(destructor.rightKey === true && destructor.upKey == false){
		if(destructor.xPos<=WIDTH-22)destructor.move(destructor.xPos+1,destructor.yPos);
    }
    else if(destructor.downKey === true && destructor.leftKey == false){
		if(destructor.yPos<=HEIGHT)destructor.move(destructor.xPos,destructor.yPos+1);
    }
    else if(destructor.upKey === true && destructor.leftKey == false){
		if(destructor.yPos<=HEIGHT)destructor.move(destructor.xPos,destructor.yPos-1);
    }
    else if(destructor.downKey === true && destructor.rightKey == false){
		if(destructor.yPos<=HEIGHT)destructor.move(destructor.xPos,destructor.yPos+1);
    }
    else if(destructor.upKey === true && destructor.rightKey == false){
		if(destructor.yPos<=HEIGHT)destructor.move(destructor.xPos,destructor.yPos-1);
    }
    else if(destructor.downKey === true && destructor.leftKey === true){
		if(destructor.yPos<=HEIGHT && destructor.xPos>=22)destructor.move(destructor.xPos-1,destructor.yPos+1);
    }
    else if(destructor.downKey === true && destructor.rightKey === true){
		if(destructor.yPos<=HEIGHT && destructor.xPos<=WIDTH-22)destructor.move(destructor.xPos+1,destructor.yPos+1);
    }
    else if(destructor.upKey === true && destructor.rightKey === true){
		if(destructor.yPos<=HEIGHT && destructor.xPos<=WIDTH-22)destructor.move(destructor.xPos+1,destructor.yPos-1);
    }
    else if(destructor.upKey === true && destructor.leftKey === true){
		if(destructor.yPos<=HEIGHT && destructor.xPos>=22)destructor.move(destructor.xPos-1,destructor.yPos+1);
    }*/
}

function _init(){
    keyDownEvents();
    keyUpEvents();
    setInterval(checkKeys,1);
}