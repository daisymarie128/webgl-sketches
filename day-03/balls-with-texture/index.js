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

    color = new THREE.Color( 0xff0000 );
    geometry = new THREE.SphereGeometry( 200, 30, 30 );

    var texture = new THREE.TextureLoader().load( "water-texture.jpg" );
    // gets rid of the obvious cuts and edges of texture
    texture.wrapS = THREE.MirroredRepeatWrapping;
    texture.wrapT = THREE.MirroredRepeatWrapping;
    texture.repeat.set( 5, 5 );
    material = new THREE.MeshBasicMaterial( { map: texture } );

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


