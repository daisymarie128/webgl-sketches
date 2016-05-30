

/* ---------------

  Experimenting with making a mesh out of particles.
  // re write of http://threejs.org/examples/#webgl_buffergeometry_constructed_from_geometry

---------------*/


var container,
    controls,
    camera,
    scene,
    renderer;

init();
animate();

function init() {
    
    // set up our basic scene
    container = document.getElementById('container');
    camera = new THREE.PerspectiveCamera(45.0, window.innerWidth / window.innerHeight, 100, 1500.0);
    camera.position.z = 1080.0;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setClearColor(0x000000, 0.0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // create some lights
    var light1 = new THREE.DirectionalLight(0x999999, 0.1);
    light1.position.set(1, 1, 1);
    var light2 = new THREE.DirectionalLight(0x999999, 1.5);
    light2.position.set(0, -1, 0);
    scene.add(new THREE.AmbientLight(0x444444));
    scene.add(light1);
    scene.add(light2);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;

    window.addEventListener('resize', onWindowResize, false);
    createScene();

}

function createScene() {

var bufferGeometry,
    radius,
    positions,
    normals,
    colors,
    subDivisions,
    height,
    phi,
    theta;

  // create our container shape/geometry
  // then define some of our values we will use later
  bufferGeometry = new THREE.BufferGeometry();
  radius = 200;
  positions = 0;
  normals = 0;
  colors = 0;
  subDivisions = 80;
  height = 70;


  for (var i = 0; i < subDivisions / 2; i++) {

    // find latitude positions for sphere
    var leftSide = (i + 0) * 180 / (subDivisions / 2);
    var rightSide = (i + 1) * 180 / (subDivisions / 2);
    var lat = (leftSide + rightSide) / 2.0;

    for (var j = 0; j < subDivisions; j++) {

      // find longitude positions for sphere
      var leftSide = (j + 0) * 360 / subDivisions;
      var rightSide = (j + 1) * 360 / subDivisions;
      var lng = (leftSide + rightSide) / 2.0;

      // math to calculate where to move the points around a sphere
      phi = lat * Math.PI / 180.0;
      theta = lng * Math.PI / 180.0;
      var x = radius * Math.sin(phi) * Math.cos(theta);
      var y = radius * Math.cos(phi);
      var z = radius * Math.sin(phi) * Math.sin(theta);

      // create our geometry
      // and then move it using our calculations
      var ball = new THREE.SphereGeometry(5, 10, 10);;
      ball.translate(0, height / 2, 0);
      ball.rotateX(-Math.PI / 2);
      ball.lookAt(new THREE.Vector3(-x, -y, -z));
      ball.translate(x, y, z);
      var color = new THREE.Color(0xffffff);
      color.setHSL(lat / 180.0, 1.0, 0.7);

      if (positions === 0) {
        var divisions = subDivisions * subDivisions / 2;
        positions = new Float32Array(divisions * ball.faces.length * 3 * 3);
        normals = new Float32Array(divisions * ball.faces.length * 3 * 3);
        colors = new Float32Array(divisions * ball.faces.length * 3 * 3);
      }

      // push balls to the right place
      ball.faces.forEach(function (face, index) {

        var curElement = ((j + i * subDivisions) * ball.faces.length + index);

        // getting confused about this part.
        // why the number 9 is being used.
        positions[ curElement * 9 + 0 ] = ball.vertices[ face.a ].x;
        positions[ curElement * 9 + 1 ] = ball.vertices[ face.a ].y;
        positions[ curElement * 9 + 2 ] = ball.vertices[ face.a ].z;
        positions[ curElement * 9 + 3 ] = ball.vertices[ face.b ].x;
        positions[ curElement * 9 + 4 ] = ball.vertices[ face.b ].y;
        positions[ curElement * 9 + 5 ] = ball.vertices[ face.b ].z;
        positions[ curElement * 9 + 6 ] = ball.vertices[ face.c ].x;
        positions[ curElement * 9 + 7 ] = ball.vertices[ face.c ].y;
        positions[ curElement * 9 + 8 ] = ball.vertices[ face.c ].z;

        normals[ curElement * 9 + 0 ] = face.normal.x;
        normals[ curElement * 9 + 1 ] = face.normal.y;
        normals[ curElement * 9 + 2 ] = face.normal.z;
        normals[ curElement * 9 + 3 ] = face.normal.x;
        normals[ curElement * 9 + 4 ] = face.normal.y;
        normals[ curElement * 9 + 5 ] = face.normal.z;
        normals[ curElement * 9 + 6 ] = face.normal.x;
        normals[ curElement * 9 + 7 ] = face.normal.y;
        normals[ curElement * 9 + 8 ] = face.normal.z;

        colors[ curElement * 9 + 0 ] = color.r;
        colors[ curElement * 9 + 1 ] = color.g;
        colors[ curElement * 9 + 2 ] = color.b;
        colors[ curElement * 9 + 3 ] = color.r;
        colors[ curElement * 9 + 4 ] = color.g;
        colors[ curElement * 9 + 5 ] = color.b;
        colors[ curElement * 9 + 6 ] = color.r;
        colors[ curElement * 9 + 7 ] = color.g;
        colors[ curElement * 9 + 8 ] = color.b;
      });
     }
    }
    bufferGeometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    bufferGeometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
    bufferGeometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

    bufferGeometry.computeBoundingSphere();

    var bufferMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shininess: 50,
      side: THREE.DoubleSide,
      vertexColors: THREE.VertexColors,
      shading: THREE.SmoothShading
    });

    var bufferMesh = new THREE.Mesh(bufferGeometry, bufferMaterial);
    scene.add(bufferMesh);

}

function onWindowResize(event) {
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  controls.update();
  requestAnimationFrame(animate);
  render();
}

function render() {
  renderer.render(scene, camera);
}
