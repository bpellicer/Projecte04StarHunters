'use strict';

function counter(){
    let ini;
    if(!ini) ini = 1;
    let increment = () => {
        return ++ini;
    }
    return increment;
}

class User{
    static counter = counter();

    constructor(){
        this.id = User.counter();
        this.spaceship = null;

        log('User '+ this.id +' connected');
    }

    close(){
        log("User "+this.id+" has disconnected");
    }
}