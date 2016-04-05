/* ----------------------------
		

		threejs shader boilerplate


		------------------------------------ */


var container,
		camera, 
		scene, 
		renderer,
		mesh, 
		geometry,
		color,
		spheres = [];

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {

	container = document.getElementById('container');

	// setup camera, scene and renderer
	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
	camera.position.z = 3200;
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.autoClear = false;
	container.appendChild( renderer.domElement );

	// create geometry and color
	geometry = new THREE.SphereBufferGeometry( 100, 20, 20 );
	color = new THREE.Color( '#D34646' );

	// create the sphere's shader material
	var shaderMaterial = new THREE.ShaderMaterial({
		vertexShader:   document.querySelector('#vertexshader').textContent,
		fragmentShader: document.querySelector('#fragmentshader').textContent
	});

	// create a new mesh with sphere geometry 
	var sphere = new THREE.Mesh( geometry, shaderMaterial);

	// add the sphere and camera to the scene
	scene.add(sphere);
	scene.add(camera);

	renderer.render(scene, camera);

	window.addEventListener( 'resize', onWindowResize, false );
}

// animate the scene
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}


