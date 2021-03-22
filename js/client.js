"use strict";

let connection; // Web Socket connection

function init() {
    let domain;     // Domain url

    if (window.location.protocol == "file:"){
        domain = "localhost";
    } else {
        domain = window.location.hostname;
    }
    let url = "ws://"+domain+":8180";
    connection = new WebSocket(url);    //We create a new Web Socket Connection
    

    
    /******* WEB SOCKET EVENTS ********/  
    
    connection.onopen = function(event) {
        // listen for nickname form submit
        $('#nickname-form').on('submit', function(event) {
            event.preventDefault();

            NICKNAME = $("#nickname").val(); // get nickname
            
            // check nickname is not empty
            if (NICKNAME != "") {
                connection.send(JSON.stringify({
                    'action': 'newUser',
                    'nickname': NICKNAME
                }));
            }
        });
    }
    

    connection.onmessage = function(event) {
        let data = JSON.parse(event.data);

        switch (data.message) {
            case "ok": // all ok
                WIDTH = data.width;
                HEIGHT = data.height;
                DIV_FORM.hide();
                GAME.show();
                GAME_ZONE.css({
                    'width': WIDTH,
                    'height': HEIGHT
                });
                spaceship = new Spaceship(NICKNAME);
                break;

            case "duplicate":
                alert("THE NICKNAME IS ALREADY IN USE");
            break;
        }   
    }

    connection.onclose = function(event){
        // alert("LA SESSIÓ S'HA TANCAT!");
    }
    
    connection.onerror = function(event){
        // alert("HI HA HAGUT UN ERROR"+event.type);
    }
}

window.onload = init;