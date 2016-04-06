/* ----------------------------
		

		threejs shader boilerplate


		------------------------------------ */


var container,
    camera, 
    scene, 
    renderer, 
    color, 
    geometry,
    material;
var uniforms;

init();
animate();

function init() {
	
    container = document.getElementById( 'container' );
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 400;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    color = new THREE.Color('#fff');
    geometry = new THREE.SphereGeometry( 200, 30, 30 );
    material = new THREE.MeshBasicMaterial( { color: color } );

    material.wireframe = true;

    sphere = new THREE.Mesh( geometry, material );
    scene.add( sphere );
    
    document.body.appendChild( renderer.domElement );
}

function onWindowResize( event ) {
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    renderer.render( scene, camera );
}


