
/* ----------------------------
  

  GETTING STARTED WITH POINTS
  AND TRYING TO MAKE A MODEL OUT OF PARTICLES
    
    Notes for animating in blender:
    ** Get this https://github.com/mrdoob/three.js/tree/master/utils/exporters/blender
      *** Install it for blender and export your oject with your animations using that.
    ** Animate using shape keys

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
  loader.load( "monkey.json", function( geometry ) {
    var material = new THREE.MeshPhongMaterial( {
      color: purple,
      specular: purple
    } );

    mesh = new THREE.Points( geometry, material );
    // mesh.rotation.x = 90;
    // mesh.scale.set( 20.5, 20.5, 20.5 );
    scene.add( mesh );
    mesh.rotation.x = 90
    mesh.position.x = -2.5
    mesh.position.y = -3
    mesh.scale.set(2, 2, 2)
    createParticles();
  });


  // add our lights to the scene
  // then setup our renderer
  scene.add( light );
  scene.add( light2 );
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
  console.log(mesh)

  var vertices = mesh.geometry.vertices;
  var buffergeometry = new THREE.BufferGeometry();
  var position = new THREE.Float32Attribute( vertices.length * 100, 3 ).copyVector3sArray( vertices );
  var customColor = new THREE.Float32Attribute( vertices.length * 100, 3 );
  // var displacement = new THREE.Float32Attribute( vertices.length * 3, 3 );
  var color = new THREE.Color( 0xffffff );


  // colors = new Float32Array(divisions * ball.faces.length * 3 * 3);
  
  buffergeometry.addAttribute( 'position', position )
  // buffergeometry.addAttribute( 'displacement', displacement );
  buffergeometry.addAttribute( 'customColor', customColor );

  for (var i = 0; i < customColor.count; i++) {
    color.setHSL( i / customColor.count, 0.0, .1 );
    color.toArray( customColor.array, i * customColor.itemSize );
  };

  uniforms = {
    amplitude: { type: "f", value: 1.0 },
    opacity:   { type: "f", value: 1.0 },
    color:     { type: "c", value: new THREE.Color( 0xff0000 ) }
  };

  var shaderMaterial = new THREE.ShaderMaterial( {
    uniforms:       uniforms,
    vertexShader:   document.getElementById( 'vertexshader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
    blending:       THREE.AdditiveBlending,
    depthTest:      false,
    transparent:    true
  });

  // object = new THREE.Line( buffergeometry, shaderMaterial );
  // var material = new THREE.MeshPhongMaterial( {
  //     color: 0xffffff,
  //     morphTargets: true,
  //     vertexColors: THREE.FaceColors,
  //     shading: THREE.FlatShading
  //   } );
  // var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  var pink = new THREE.Color( "#1565C0" );
  particleMaterial = new THREE.PointsMaterial( { 
    color: pink,
    size: 0.05
     } );
  var object = new THREE.Points( buffergeometry, particleMaterial );
  object.rotation.x = 90
  object.position.x = 2.5
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



