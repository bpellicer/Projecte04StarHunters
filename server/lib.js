'use strict';

function log(data) {
	console.log(`[${new Date().toLocaleString()}] ${data}`);
}

module.exports = {log};