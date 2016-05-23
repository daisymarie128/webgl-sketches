/* ----------------------------


		threejs shader boilerplate
		making an image out of particles


		------------------------------------ */


var container;
var camera, scene, renderer;
var uniforms;

init();
animate();

function init() {

    container = document.getElementById( 'container' );
    camera = new THREE.Camera();
    camera.position.z = 1;
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );

    container.appendChild( renderer.domElement );

    onWindowResize();
    window.addEventListener( 'resize', onWindowResize, false );

    document.onmousemove = function(e){
    }
}

// this is where i will load my images
function loadImages() {

}

// this is where I will draw the images to the canvas to get color values
function drawImage() {

}

// this is where i fill create particles
function createParticles() {

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
