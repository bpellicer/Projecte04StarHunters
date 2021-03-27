"use strict";

let connection; // Web Socket connection

function init() {
    let domain = window.location.protocol === 'file:' ? '192.168.0.10' : window.location.hostname;
	connection = new WebSocket(`ws://${domain}:8180`);    
    
    /******* WEB SOCKET EVENTS ********/  
    
    connection.onopen = function(event) {
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
        connection.send(JSON.stringify({
            'action': 'play_game'
        }));
    }
    

    connection.onmessage = function(event) {
        let data = JSON.parse(event.data); // cast data to json

        switch (data.msg) {
            case 'no_host_active':
                // go back to index.html
                window.location.replace("index.html");
                break;

            case 'ok':
                // set game zone width and height
                WIDTH = data.config.width;
                HEIGHT = data.config.height;
                GAME_ZONE.css({
                    'width': WIDTH,
                    'height': HEIGHT
                });

                DIV_FORM.hide();
                GAME.show();
                break;
            
            case 'add_players':
                addPlayers(data.players);
                break;
            
            case 'add_star':
                addStar(data.star);
                break;

            case 'remove_star':
                removeStar(data.star);
                break;

            case 'move_spaceships':
                movePlayers(data.players);
                break;
            
            case 'player_disconnected':
                removePlayer(data.user);
                break;

            case 'duplicate_nickname':
                $("#duplicate_nickname").css("visibility","visible");
                break;
            
            case 'start_game':
                startGame();
                break;
            
            case 'end_game':
                endGame();
                generateScoreList(data.players);
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