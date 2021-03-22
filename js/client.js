"use strict";

let connection; // Web Socket connection

function init() {

    let nickname = $("#nickname");

    let domain;     // Domain url

    if(window.location.protocol == "file:"){
        domain = "localhost";
    }
    else{
        domain = window.location.hostname;
    }
    let url = "ws://"+domain+":8180";
    connection = new WebSocket(url);    //We create a new Web Socket Connection
    
    
    /******* WEB SOCKET EVENTS ********/  
    
    connection.onopen = function(event){
        $("#goPlay").on("click",function(){
            if($("#newUser").val() != ""){
                connection.send(JSON.stringify({action:"newUser",nick:nickname})); //Sending petition
            }
        });
    }
    
    connection.onmessage = function(event){
        let data = JSON.parse(event.data);
        switch(data.action){
            case "ok":
                WIDTH = data.width;
                HEIGHT = data.height;
                let spaceship = new Spaceship(nickname);

            break;
            case "duplicate":
                alert("THE NICKNAME IS ALREADY IN USE");
            break;
        }   
    }

    connection.onclose = function(event){
        alert("LA SESSIÓ S'HA TANCAT!");
    }
    
    connection.onerror = function(event){
        alert("HI HA HAGUT UN ERROR"+event.type);
    }
}

window.onload = init;