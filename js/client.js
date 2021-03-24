"use strict";

let connection; // Web Socket connection

function init() {
    let domain = window.location.protocol === 'file:' ? 'localhost' : window.location.hostname;
	connection = new WebSocket(`ws://${domain}:8180`);    
    
    /******* WEB SOCKET EVENTS ********/  
    
    connection.onopen = function(event) {
        connection.send(JSON.stringify({
            'msg': 'play_game'
        }));

        // listen for nickname form submit
        $('#nickname-form').on('submit', function(event) {
            event.preventDefault();

            NICKNAME = $("#nickname").val(); // get nickname
            
            // check nickname is not empty
            if (NICKNAME != "") {
                connection.send(JSON.stringify({
                    'action': 'register_nickname',
                    'nickname': NICKNAME
                }));
            }
        });
    }
    

    connection.onmessage = function(event) {
        let data = JSON.parse(event.data); // cast data to json

        switch (data.msg) {
            case 'no_host_active':
                // go back to index.html
                break;

            case 'ok':
                // set game zone width and height
                WIDTH = data.config.width;
                HEIGHT = data.config.height;
                GAME_ZONE.css({
                    'width': WIDTH,
                    'height': HEIGHT
                });

                // create the user spaceship
                spaceship = new Spaceship(NICKNAME);

                DIV_FORM.hide();
                GAME.show();
                break;
            
            case 'add_players':
                addPlayers(data.players);
                break;
            
            case 'add_star':
                addStar(data.star);
                break;
            
            case 'player_disconnected':
                removePlayer(data.user);
                break;

            case 'duplicate_nickname':
                $("#duplicate_nickname").css("visibility","visible");
                break;
            
            case 'start_game':
                moveKeys();
                break;
            
            case 'end_game':
                // stop listening for keydown and keyup events on document
                $(document).off('keydown keyup');
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