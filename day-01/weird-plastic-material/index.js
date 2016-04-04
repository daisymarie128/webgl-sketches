if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container;

var camera, scene, renderer;
var cameraCube, sceneCube;

var mesh, lightMesh, geometry;
var spheres = [];

var directionalLight, pointLight;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

document.addEventListener( 'mousemove', onDocumentMouseMove, false );

init();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
	camera.position.z = 3200;

	cameraCube = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );

	scene = new THREE.Scene();
	sceneCube = new THREE.Scene();

	var geometry = new THREE.TorusBufferGeometry( 100, 20, 20, 10 );

	var path = "crushed-black-paper-texture";
	var format = '.jpg';
	var urls = [
		path + format, path + format,
		path + format, path + format,
		path + format, path + format
	];

	var textureCube = new THREE.CubeTextureLoader().load( urls );
	textureCube.mapping = THREE.CubeRefractionMapping;
	var color = new THREE.Color( '#D34646' )
	var material = new THREE.MeshBasicMaterial( { color: color, envMap: textureCube, refractionRatio: 0.95, combine: 0.0001 } );

	for ( var i = 0; i < 500; i ++ ) {

		var mesh = new THREE.Mesh( geometry, material );

		mesh.position.x = Math.random() * 10000 - 5000;
		mesh.position.y = Math.random() * 10000 - 5000;
		mesh.position.z = Math.random() * 10000 - 5000;
		mesh.rotation.x = Math.random() * 10 - 100;
		mesh.rotation.y = Math.random() * 10 - 100;

		mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;

		scene.add( mesh );

		spheres.push( mesh );

	}

	// Skybox

	var shader = THREE.ShaderLib[ "cube" ];
	shader.uniforms[ "tCube" ].value = textureCube;

	var material = new THREE.ShaderMaterial( {

		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms,
		depthWrite: false,
		side: THREE.BackSide

	} ),

	mesh = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), material );
	sceneCube.add( mesh );

	//

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.autoClear = false;
	container.appendChild( renderer.domElement );

	//

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2,
	windowHalfY = window.innerHeight / 2,

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	cameraCube.aspect = window.innerWidth / window.innerHeight;
	cameraCube.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove(event) {

	mouseX = ( event.clientX - windowHalfX ) * 10;
	mouseY = ( event.clientY - windowHalfY ) * 10;

}

//

function animate() {

	requestAnimationFrame( animate );

	render();

}

function render() {

	var timer = 0.0001 * Date.now();

	for ( var i = 0, il = spheres.length; i < il; i ++ ) {

		var sphere = spheres[ i ];

		sphere.position.x = 5000 * Math.cos( timer + i );
		sphere.position.y = 5000 * Math.sin( timer + i * 1.1 );

	}

	camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY - camera.position.y ) * .05;

	camera.lookAt( scene.position );
	cameraCube.rotation.copy( camera.rotation );

	renderer.render( sceneCube, cameraCube );
	renderer.render( scene, camera );

}