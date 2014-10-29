if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var addListener = function( e, str, func ) {
	if( e.addEventListener ) {
		e.addEventListener( str, func, false );
	}else if( e.attachEvent ) {
		e.attachEvent( "on" + str, func );
	}else {
		
	}
};

addListener( window, "load", start );
		
var container, camera, scene, renderer, stats, info;
var keyboard;
var W, H;

var PLANE_WIDTH = 1440;
var TOTALBYTE = 32;
var fList = [];	// frequecies

// visualizer
var baseH = 20, baseW = 20;
var count = 0;

// light
var spotlight;

/* ------------------------------------
	start
------------------------------------*/

function start() {
	setup();
	draw();
}

/* ------------------------------------
	setup
------------------------------------*/

function setup() {
	// common setting
	init();

	// wireframe
	var wgeometry = new THREE.PlaneGeometry( PLANE_WIDTH, PLANE_WIDTH, 100, 100 );
	var wmaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: false, wireframeLinewidth: 1 } );
	var plane = new THREE.Mesh( wgeometry, wmaterial );
	plane.scale.set( 1, 1, 1 );
	plane.position.y = -10.5;
	plane.rotation.x = - Math.PI / 2;
	plane.receiveShadow = true;
	scene.add( plane );

	// debug
	var litCube = new THREE.Mesh(
	new THREE.CubeGeometry(50, 50, 50),
	new THREE.MeshLambertMaterial({color: 0xFFFFFF}));
	litCube.position.y = 50;
	// scene.add(litCube);
	litCube.castShadow = true;
    litCube.receiveShadow = true;

	// sampler
	var frequencies = new THREE.Object3D();
	scene.add(frequencies);

	var geometryBar = new THREE.CylinderGeometry(baseW, baseW, baseH, 100);
	// geometryBar.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, 0 ) );	
	var barMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF});

	for (var i = 0; i < TOTALBYTE; i++) {
		for (var j = 0; j < TOTALBYTE; j++) {
		    var freq = new THREE.Mesh(geometryBar, barMaterial);
			freq.position.x = j * (baseW * 2 + 5) - PLANE_WIDTH / 2 + baseW / 2;
			freq.position.z = i * (baseW * 2 + 5) - PLANE_WIDTH / 2 + baseW / 2;
			freq.castShadow = true;
	     	freq.receiveShadow = true;
			frequencies.add(freq);
			fList.push(freq);
		};
	}
}

/* ------------------------------------
	draw
------------------------------------*/

function draw() {
	var time = Date.now();
	time *= params.speed / 100000;

	var levels = 0;	

	for (var i = 0; i < fList.length; i++) {
		var f1 = fList[i];
		var sinF = Math.sin( (time + i) * params.sinSpeed)  * 0.4 + 0.6;
		sinF *= params.barH;
		f1.scale.set(1, sinF, 1);
	}

	count++;

	if(count > TOTALBYTE-1) {
		count = 0;
	}

	camera.position.x = Math.sin(time) * params.cameraX;
    camera.position.y = params.cameraY;
    camera.position.z = Math.cos(time) * params.cameraZ;

    spotlight.position.x = params.lightX;
    spotlight.position.y = params.lightY;
    spotlight.position.z = params.lightZ;
    

	// rendering & updating
	requestAnimationFrame( draw );
	renderer.render( scene, camera );
	stats.update();
}


/* ------------------------------------
	common setting
------------------------------------*/

function init() {
	W = window.innerWidth, H = window.innerHeight;

	// renderer
	renderer = new THREE.WebGLRenderer();
	// renderer.setClearColor(0x000000, 1);
	renderer.setSize( W, H );
	// enable shadows on the renderer
	renderer.shadowMapEnabled = true;
	
	// scene
	scene = new THREE.Scene();

	// camera
	resetCamera();
	
	// Container
	container = document.getElementById( 'threeJs' );
	container.appendChild( renderer.domElement );

	spotlight = new THREE.SpotLight(0xffff00);
	spotlight.position.set(-60,150,-30);
	spotlight.shadowCameraVisible = true;
	spotlight.shadowDarkness = 0.95;
	spotlight.intensity = 2;
	// must enable shadow casting ability for the light
	spotlight.castShadow = true;
	scene.add(spotlight);

	// stats
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );

	// info
	info = document.getElementById( 'info' );

	// events
	keyboard = new THREEx.KeyboardState();
	window.addEventListener( 'resize', onWindowResize, false );
	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });

	// GUI
	setupGUI();
}

/* ------------------------------------
	setup GUI
------------------------------------*/

/*
	for dat.GUI:
	dat-gui - A lightweight controller library for JavaScript.
	https://code.google.com/p/dat-gui/
*/

var params = 
{
	fov: 40, 
	cameraX: 300, 
	cameraY: 300, 
	cameraZ: 300,
	lightX: 2000,
	lightY: 5000,
	lightZ: -30,
	barH: 10,
	speed: 70,
	sinSpeed: 6.5
};

function setupGUI() {
	var gui = new dat.GUI({ load: {
		"closed": false,
		"remembered": {
			"Default": {
				"0": {
					"fov": 40,
					"cameraX": 300,
					"cameraY": 300,
					"cameraZ": 300,
					"lightX": 2000,
					"lightY": 5000,
					"lightZ": -30,
					"barH": 10,
					"speed": 70,
					"sinSpeed": 6.5
				}
			},
		},
		"folders": {},
		// "preset": "Default"
		}
	});

	gui.remember(params);
	
	var f = gui.add( params, 'fov', 0, 180).name('field of view');
	var cx = gui.add( params, 'cameraX', 0, 1000 ).name('cameraX');
	var cy = gui.add( params, 'cameraY', 0, 3000 ).name('cameraY');
	var cz = gui.add( params, 'cameraZ', 0, 1000 ).name('cameraZ');
	var sp = gui.add( params, 'speed', 0, 100 ).name('speed');
	var lx = gui.add( params, 'lightX', -4000, 4000 ).name('lightX');
	var ly = gui.add( params, 'lightY', 0, 10000 ).name('lightY');
	var lz = gui.add( params, 'lightZ', -4000, 4000 ).name('lightZ');
	var barH = gui.add( params, 'barH', 1, 100 ).name('barH');
	var sinSpeed = gui.add(params, 'sinSpeed', 0, 10);
	
	var p = new Array( f, cx, cy, cz );
	
	// set .onChange function for each values.
	DatGuiManager.setOnChange(p, "restart");

	// default
	gui.close();
}

/* ------------------------------------
	window resize
------------------------------------*/

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

	// toggle info
	if(document.webkitIsFullScreen || document.mozFullScreen) {
		info.style.display = "none";
	} else {
		info.style.display = "block";
		console.assert(false);
	}
}

/* ------------------------------------
	reset a camera
------------------------------------*/

function resetCamera() {
	var near = 1;
	var far = 10000;
	camera = new THREE.PerspectiveCamera( params.fov, W/H, near, far );

	camera.position.set(params.cameraX, params.cameraY, params.cameraZ);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
}

/* ------------------------------------
	restart when changes on GUI
------------------------------------*/

function restart() {
	resetCamera();
}