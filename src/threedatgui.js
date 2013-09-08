/*
	based on:
	davidedc/using-dat-gui-with-processing-js
	https://github.com/davidedc/using-dat-gui-with-processing-js

*/

	window.speed = 0.5;
	window.rotationX = 0.4;
	// window.rotX = 0;
	// window.rotY = 200;
	// window.rotZ = 400;

	parameters = {
		// startunnel: function() { restartEngine( Examples.fountain ); }		
		startunnel: function() { restartEngine( Examples.startunnel ); }		
	};

	window.onload = function() {
	gui = new dat.GUI();
	gui.add(window, 'speed', 0, 1.2);
	gui.add(window, 'rotationX', 0, 3);
	// gui.add(window, 'rotY', -500, 500);
	// gui.add(window, 'rotZ', -500, 500);
	// gui.add(window, 'rotX', -1, 1);
	// gui.add(window, 'rotY', -1, 1);
	// gui.add(window, 'rotZ', -1, 1);
	// gui.add( parameters, 'startunnel' ).name("Star Tunnel");
	
	gui.open();	
};