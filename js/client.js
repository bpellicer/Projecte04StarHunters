"use strict";

let connection; // Web Socket connection

function init() {
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
        connection.send(JSON.stringify({action:"addPlayer"})); //Sending petition
    }
    
    connection.onmessage = function(event){
        let action = JSON.parse(event.data.action);
        switch(action){

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