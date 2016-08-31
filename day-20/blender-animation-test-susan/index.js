
/* ----------------------------


  GETTING STARTED WITH IMPORTING BLENDER MODELS
  PLUS IMPORTING ANIMATIONS

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
    renderer,
    time,
    mixers = [],
    clock = new THREE.Clock();

init();
animate();

function init() {
  container = document.createElement('div');
  document.body.appendChild(container);
  camera = new THREE.PerspectiveCamera(400, screenWindth / screenHeight, 1, 10000);
  camera.position.z = 300;
  scene = new THREE.Scene();

  //colors for lights
  var blue = new THREE.Color("#29B6F6");
  var white = new THREE.Color("#fff");
  var darkGrey = new THREE.Color("#212121");
  var teal = new THREE.Color("#455A64");
  var light = new THREE.DirectionalLight(blue, 0.5);
  var light2 = new THREE.DirectionalLight(white, 1);
  light2.position.set(-2, -3, 1);
  light.position.set(1, 1, 1);

  // import our blender object
  var loader = new THREE.JSONLoader();
  loader.load("morph-basics.json", function(geometry) {
    var material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      morphTargets: true,
      vertexColors: THREE.FaceColors,
      shading: THREE.FlatShading
    });

    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = - 50;
    mesh.scale.set(20.5, 20.5, 20.5);
    scene.add(mesh);

    // player for animation clips
    var mixer = new THREE.AnimationMixer(mesh);
    mixer.clipAction(geometry.animations[0]).setDuration(1).play();
    mixers.push(mixer);
  });

  // import our blender object
  // this will be our mesh that is smooth
  loader.load("morph-basics.json", function(geometry, materials) {

    // computes vertex normals by averaging face normals
    // computeMorphNormals needed to stop wacky melty flash
    geometry.computeVertexNormals();
    geometry.computeMorphNormals();

    /* ---------------

      unlike the last model now we are using the
      material exported from blender

      ---------------*/
    var material = materials[0];
    materials[0].morphTargets = true;
    materials[0].morphNormals = true;
    materials[0].shading = THREE.SmoothShading;

    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = 50;
    mesh.scale.set(20.5, 20.5, 20.5);
    scene.add(mesh);

    //
    var mixer = new THREE.AnimationMixer(mesh);
    mixer.clipAction(geometry.animations[0]).setDuration(1).play();
    mixers.push(mixer);

  });

  // add our lights to the scene
  // then setup our renderer
  scene.add(light);
  scene.add(light2);
  scene.add(new THREE.HemisphereLight(darkGrey, teal));
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(screenWindth, screenHeight);
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);

}

// resizes our renderer
function onWindowResize(event) {
  screenWindth = window.innerWidth;
  screenHeight = window.innerHeight;
  renderer.setSize(screenWindth, screenHeight);
  camera.updateProjectionMatrix();
}

function animate() {
  requestAnimationFrame(animate);
  render();
}


function render() {
  time = clock.getDelta();
  for (var i = 0; i < mixers.length; i ++) {
    mixers[i].update(time);
  }

  renderer.clear();
  renderer.render(scene, camera);
}
