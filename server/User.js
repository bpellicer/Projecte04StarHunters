'use strict';

function counter(){
    let ini;
    if(!ini) ini = 1;
    let increment = () => {
        return ini++;
    }
    return increment;
}

class User{
    static counter = counter();

    constructor(){
        this.id = User.counter();
        this.spaceship = null;

        console.log('User '+ this.id +' connected');
    }

    close(){
        console.log("User "+this.id+" has disconnected");
    }
}

module.exports = User;