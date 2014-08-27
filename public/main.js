(function() {

	//Configure requestAnimationFrame
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;

	//Configure web sockets
	window.WebSocket = window.WebSocket || window.MozWebSocket;

})();

$(document).ready(function() {
	
	var cnv = $("canvas")[0],
		ctx = cnv.getContext("2d"),
		connection = new WebSocket("ws://127.0.0.1:8080"),
		connectionStatus = "noConnection",
		connectionStatusMessages = {
			"noConnection": "Not Connected",
			"ok": "Connected",
			"error": "Connection error"
		},
		locations = [],
		isMouseDown = false;

	//Handle connection open
    connection.onopen = function () {
    	connectionStatus = "ok";
    };
 
 	//Handle error
    connection.onerror = function (error) {
        connectionStatus = "error";
    };
 
 	//Handle incomming messages
    connection.onmessage = function (message) {

    	var location = JSON.parse(message.data);

    	locations.push(location);

    };

    $(cnv).on("mousedown", function() {
		isMouseDown = true;
    }).on("mouseup", function() {
		isMouseDown = false;
    });

    $(cnv).on("mousemove", function(event) {
		if ( isMouseDown && connectionStatus == "ok" ) {
			connection.send(JSON.stringify({
				x: event.offsetX,
				y: event.offsetY,
			}));
		}
    });

    //Render scene
	function render() {

		ctx.clearRect(0, 0, cnv.width, cnv.height);

		//Inform connection status
		ctx.fillStyle = "blue";
		ctx.font = "16px Arial";
		ctx.fillText(connectionStatusMessages[connectionStatus], 10, 20);

		ctx.fillStyle = "orange";

		for ( var i = 0; i < locations.length; i++ ) {

			var currentLocation = locations[i];

			ctx.fillRect(currentLocation.x, currentLocation.y, 3, 3);

		}

	    requestAnimationFrame(render);

	}

	requestAnimationFrame(render);

});