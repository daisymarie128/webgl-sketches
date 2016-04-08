/* ----------------------------
        

        playing with sprites


        ------------------------------------ */


var camera, scene, renderer;
var cameraOrtho, sceneOrtho;
var blackDotMaterial;
var group;

init();
animate();

function init() {
  var width = window.innerWidth;
  var height = window.innerHeight;
  camera = new THREE.PerspectiveCamera( 60, width / height, 1, 2100 );
  camera.position.z = 1500;
  scene = new THREE.Scene();
  sceneOrtho = new THREE.Scene();
  // create sprites
  var amount = 100;
  var radius = 600;
  var textureLoader = new THREE.TextureLoader();
  // var redDotTexture = textureLoader.load( "red.png" );
  blackDotTexture = textureLoader.load( "black-dot.png" );
  group = new THREE.Group();

  blackDotMaterial = new THREE.SpriteMaterial( { 
    map: blackDotTexture, 
    color: 0xffffff 
  });

  for (var i = 0; i < amount; i ++) {
    var x = Math.random() - 0.5;
    var y = Math.random() - 0.5;
    var z = Math.random() - 0.5;

    material = blackDotMaterial.clone();

    // change this to make the dots hover a little bit
    // material.map.offset.set( -0.1, -0.1 );
    material.map.repeat.set( 2, 2 );

    var sprite = new THREE.Sprite( material );
    sprite.position.set( x, y, z );

    // could do this or normailze the position
    // just need to multiplyScalar to be multiplied by 1
    sprite.position.setLength(1.0);

    // times by the length by the radius
    // creates the sphere looking effect
    sprite.position.multiplyScalar( radius );
    group.add( sprite );
  }
  scene.add( group );

  // renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor(0xffffff, 1);
  renderer.autoClear = false; // To allow render overlay on top of sprited sphere
  document.body.appendChild( renderer.domElement );
  
  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  var width = window.innerWidth;
  var height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
  var time = Date.now() / 1000;

  // loop through all the sprites in the object
  for ( var i = 0; i < group.children.length; i ++ ) {
    var random = Math.random();
    var sprite = group.children[i];
    var scale = Math.sin( sprite.position.z / 10);
    var imageWidth = 80;
    var imageHeight = 80;

    sprite.scale.set( scale * imageWidth, scale * imageHeight, 1.0 );
    sprite.material.opacity = Math.sin( time + sprite.position.x * 0.01 ) * 0.4 + 0.6;
  }
  group.rotation.x = time * 0.5;
  group.rotation.y = time * 0.75;
  group.rotation.z = time * 1.0;
  requestAnimationFrame( animate );
  render();
}
function render() {
  renderer.clear();
  renderer.render( scene, camera );
}