/* ----------------------------


		threejs
        playing with a tunnel effect


		------------------------------------ */


var container;
var camera,
    scene,
    renderer,
    tunnel,
    spline,
    tubeGeometry,
    material;

var cameraTravelIncrement   = 0.0002,
    cameraRotationIncrement = 0.0025,
    cameraTravelledStep = 0,
    cameraRotationStep = 0.0,
    subdivisions = 30,
    segments = 150,
    radius = 30,
    // this is like quality of geometry
    // heigher number = smoother tube
    radiusSegments = 3;

init();
animate();

function init() {
    container = document.getElementById( 'container' );
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1;
    scene = new THREE.Scene();

    // create our tunnel
    createTunnel();
    scene.add(tunnel);

    // this is ourglitch effect
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( scene, camera ) );
    glitchPass = new THREE.GlitchPass();
    glitchPass.renderToScreen = true;
    composer.addPass( glitchPass );
    container.appendChild( renderer.domElement );
    onWindowResize();
    window.addEventListener( 'resize', onWindowResize, false );
}

function createTunnel() {

    // Generate some random points to make our spline/tube
    var points = [];
    var previousPoint = new THREE.Vector3(0, 0, 0);
    for (var i = 0; i < subdivisions; i++) {
        var randomX = previousPoint.x + 100 + Math.round(Math.random() * 700);
        var randomY = previousPoint.y + 100 + Math.round(Math.random() * 700);
        var randomZ = previousPoint.z + 100 + Math.round(Math.random() * 700);

        previousPoint.x = randomX;
        previousPoint.y = randomY;
        previousPoint.z = randomZ;

        points.push(new THREE.Vector3(randomX, randomY, randomZ));
    }

    // our texture is what we'll use to make the lines in the tunnel
    var texture = new THREE.TextureLoader().load( "pink-single-larger-01-01.png" );
    texture.wrapS = THREE.MirroredRepeatWrapping;
    // texture.wrapT = THREE.MirroredRepeatWrapping;

    // how many times our texture should wrap.
    texture.repeat.set( 250, 1 );

    // create our spline from the points we generated
    spline = new THREE.CatmullRomCurve3(points);

    // Make our tube geometry from our spline
    tubeGeometry = new THREE.TubeGeometry(spline, segments, radius, radiusSegments, false);

    // make our material
    material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: false,
        opacity: 1,
        side:THREE.BackSide
    });

    // raindbow outline tunnel
    // this is also good for seeing how our spline looks with the amount of segments etc.
    // material = new THREE.MeshNormalMaterial({
    //     transparent: false,
    //     opacity: 0.8,
    //     side:THREE.DoubleSide,
    //     wireframe: true
    // });


    tunnel = new THREE.Mesh(tubeGeometry, material);
    console.log(tunnel)
}

function onWindowResize( event ) {
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {

    // animate our camera to follow our tunnel tube
    // this is for what the camera should look at
    // if we just use cameraTravelIncrement - it feels like a backwards movement
    var position1 = spline.getPointAt(cameraTravelledStep);
    var position2 = spline.getPointAt(cameraTravelledStep + cameraTravelIncrement);
    camera.position.set(position1.x, position1.y, position1.z);
    camera.lookAt(position2);

    // camera.rotation.z = -Math.PI/2 + (Math.sin(cameraRotationStep) * Math.PI);
    cameraTravelledStep += cameraTravelIncrement;
    cameraRotationStep += cameraRotationIncrement;
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    requestAnimationFrame( animate );
    render();
}

function render() {
    composer.render();
    // renderer.render( scene, camera );
}
