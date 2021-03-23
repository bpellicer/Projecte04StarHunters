'use strict';

const lib = require('./lib');

function counter() {
    let ini;
    if(!ini) ini = 1;
    let increment = () => {
        return ini++;
    }
    return increment;
}

class User {
    static counter = counter();
    id;
    nickname;
    spaceship;

    constructor() {
        this.id = User.counter();

        lib.log(`New user connected. ID: ${this.id}`);
    }

    close(players) {
        lib.log(`User ${this.id} disconnected.`);

        // remove user from players list
		players.forEach((player,index) => {
			if (player.nickname === this.nickname) {
				players.splice(index,1);
			}
		});
    }
}

module.exports = User;