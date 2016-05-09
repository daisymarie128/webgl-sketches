

/* ---------------

  Experimenting with making particles.

---------------*/


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
