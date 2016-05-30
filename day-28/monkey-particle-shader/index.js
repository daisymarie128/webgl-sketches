
/* ----------------------------
  

  GETTING STARTED WITH POINTS
  AND TRYING TO MAKE A MODEL OUT OF PARTICLES
    
    Notes:
    ** Still need to 

------------------------------------------------*/



var screenWindth = window.innerWidth;
var screenHeight = window.innerHeight;

var container,
    camera,
    scene,
    controls,
    renderer,
    time,
    colors = [
      'red', 'green', 'blue'
    ],
    particleMaterial,
    mesh,
    mixers = [],
    clock = new THREE.Clock();

init();
animate();

function init() {
  container = document.createElement( 'div' );
  document.body.appendChild( container );
  camera = new THREE.PerspectiveCamera( 400, screenWindth / screenHeight, 1, 10000 );
  camera.position.z = 20;
  scene = new THREE.Scene();

  //colors for lights
  var blue = new THREE.Color( "#29B6F6" );
  var white = new THREE.Color( "#fff" );
  var darkGrey = new THREE.Color( "#212121" );
  var teal = new THREE.Color( "#455A64" );
  var light = new THREE.DirectionalLight( blue, 0.5 );
  var light2 = new THREE.DirectionalLight( white, 1 );
  light2.position.set( -2, -3, 1 );
  light.position.set( 1, 1, 1 );

  // import our blender object
  var purple = new THREE.Color( "#F50057" );
  var loader = new THREE.JSONLoader();
  loader.load( "../../../models/monkey.json", function( geometry ) {
    var material = new THREE.MeshPhongMaterial( {
      color: purple,
      specular: purple
    } );

    mesh = new THREE.Mesh( geometry, material );
    // scene.add( mesh );
    // mesh.rotation.x = 90
    // mesh.position.x = -2.5
    // mesh.position.y = -3
    // mesh.scale.set(2, 2, 2)
    createParticles();
  });

  // add our lights to the scene
  // then setup our renderer
  // scene.add( light );
  // scene.add( light2 );
  scene.add( new THREE.HemisphereLight( darkGrey, teal ) );
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( screenWindth, screenHeight );
  renderer.setClearColor( "#F5F5F5" );
  container.appendChild( renderer.domElement );

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = false;

  window.addEventListener( 'resize', onWindowResize, false );

}

function createParticles() {

  // loop through geometries vertices
  var vertices = mesh.geometry.vertices;
  var buffergeometry = new THREE.BufferGeometry();
    for (var i = 0; i < vertices.length; i++) {
    var vert = vertices[i];

    var x = Math.random() * vert.x;
    var y = Math.random() * vert.y;
    var z = Math.random() * vert.z;

    vertices.push(new THREE.Vector3( x, y, z ))
  };
  var position = new THREE.Float32Attribute( vertices.length * 100, 3 ).copyVector3sArray( vertices );
  var customColor = new THREE.Float32Attribute( vertices.length * 100, 3 );
  var color = new THREE.Color( 0xffffff );

  buffergeometry.addAttribute( 'position', position )
  // buffergeometry.addAttribute( 'displacement', displacement );
  buffergeometry.addAttribute( 'customColor', customColor );

  for (var i = 0; i < customColor.count; i++) {
    color.setHSL( i / customColor.count, 0.0, .1 );
    color.toArray( customColor.array, i * customColor.itemSize );
  };

  var pink = new THREE.Color( "#1565C0" );
  particleMaterial = new THREE.PointsMaterial({ 
    color: pink,
    size: 0.08
  });




  var object = new THREE.Points( buffergeometry, particleMaterial );
  object.rotation.x = 90
  // object.position.x = 2.5
  object.position.y = -3
  object.scale.set(2, 2, 2)
  scene.add( object );
}

// resizes our renderer
function onWindowResize( event ) {
  screenWindth = window.innerWidth;
  screenHeight = window.innerHeight;
  renderer.setSize( screenWindth, screenHeight );
  camera.updateProjectionMatrix();
}

function animate() {
  controls.update();
  requestAnimationFrame( animate );
  render();
}


function render() {
  // time = clock.getDelta();
  // renderer.clear();
  renderer.render( scene, camera );
}



