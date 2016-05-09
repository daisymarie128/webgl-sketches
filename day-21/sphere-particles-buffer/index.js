/* ----------------------------
    

    threejs 
    playing with particles.
    This experiment is using THREE.Points and pushing verticies to a geometry
    Not sure if this is the most performant way to make a shape out of particles.
    // Next experiment will be with buffer gerometry

    ------------------------------------ */


var width = window.innerWidth,
    height = window.innerHeight;

var container,
    renderer,
    camera,
    scene,
    sphere,
    particles;

init();
animate();

function init() {
  var directionalLight;

  //div element that will hold renderer
  container = document.createElement('div');
  document.body.appendChild(container);

  //camera
  camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 10000);
  camera.position.z = 300;

  //lights
  directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
  directionalLight.position.set(0, -1, 0);

  // scene
  scene = new THREE.Scene();
  scene.add(camera);
  scene.add(directionalLight);

  // this will be the scale of our sphere
  var radius = 80;    
  var geometry = new THREE.Geometry();

  // here we make 1000 verticies
  // with a particle on each point
  for (var i = 0; i < 1000; i++) {

      var vertex = new THREE.Vector3();

      // Theta (θ) and phi (ϕ)
      // There used to measure angles
      // this might help:
      // http://math.oregonstate.edu/home/programs/undergrad/CalculusQuestStudyGuides/vcalc/coord/coord.html
      // Random float from - range / 2 to range / 2 interval
      var theta = THREE.Math.randFloatSpread(6);
      var phi = THREE.Math.randFloatSpread(6);
      
      vertex.x = radius * Math.sin(theta) * Math.cos(phi);
      vertex.y = radius * Math.sin(theta) * Math.sin(phi);
      vertex.z = radius * Math.cos(phi);
      // this makes a flat disk
      // vertex.z = Math.cos(phi);

      geometry.vertices.push(vertex);
  }

  var pink = new THREE.Color( "#FF4081" );
  var white = new THREE.Color( "#fff" );
  particles = new THREE.Points(geometry, new THREE.PointsMaterial({color: pink}));
  scene.add(particles);

  //renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  renderer.setClearColor(white, 1);
  container.appendChild(renderer.domElement);

  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize( event ) {
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
  var time = Date.now() * 0.001;
  particles.rotation.x = time * 0.5;
  particles.rotation.y = time * 0.5;
  renderer.render( scene, camera );
}


