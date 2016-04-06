/* ----------------------------
		

		threejs shader boilerplate


		------------------------------------ */


var container,
    camera, 
    scene, 
    renderer, 
    color, 
    geometry,
    material,
    amount;
var uniforms;

init();
animate();

function init() {
    amount = 20;
    container = document.getElementById( 'container' );
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 800;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    color = new THREE.Color( 0xff0000 );
    geometry = new THREE.SphereGeometry( 70, 20, 20 );
    var texture = new THREE.TextureLoader().load( "white-polka-dots.png" );
    
    // gets rid of the obvious cuts and edges of texture
    texture.wrapS = THREE.MirroredRepeatWrapping;
    texture.wrapT = THREE.MirroredRepeatWrapping;
    texture.repeat.set( 4, 2 );
    material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide } );

    sphereMesh = new THREE.Mesh( geometry, material );
    for (var i = 0; i < amount; i ++) {
      sphere = sphereMesh.clone();
      sphere.position.x = (Math.random() * 501 - 200) * 2.0;
      sphere.position.y = (Math.random() * 501 - 200) * 2.0;
      sphere.position.z = (Math.random() * 501 - 200) * 2.0;

      scene.add( sphere );
    }

    
    document.body.appendChild( renderer.domElement );
}

function onWindowResize( event ) {
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
   var time = Date.now() / 1000;
  for (var i = 0; i < scene.children.length; i ++) {
      var cur = scene.children[i];
      console.log('cur', cur)
      var scale = Math.sin( time + i * 3.0 ) * 3.0;
      cur.scale.set( scale, scale, scale );
      cur.rotation.x = Math.sin(time * 2.0);
      cur.rotation.z = Math.sin(time * 2.0);
    }
    requestAnimationFrame( animate );
    render();
}

function render() {
    renderer.render( scene, camera );
}


