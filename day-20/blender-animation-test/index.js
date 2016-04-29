var scene, camera, renderer;

var WIDTH  = window.innerWidth;
var HEIGHT = window.innerHeight;

var SPEED = 0.01;

var mixer, dae;
var clock = new THREE.Clock();
// Collada model
var loader = new THREE.ColladaLoader();
loader.options.convertUpAxis = true;
loader.load( 'cube-animation-test.dae', function ( collada ) {
    dae = collada.scene;
    dae.traverse( function ( child ) {
        if ( child instanceof THREE.SkinnedMesh ) {
            var animation = new THREE.Animation( child, child.geometry.animation );
            animation.play();
        }
    } );
    dae.scale.x = dae.scale.y = dae.scale.z = 0.002;
    dae.position.x = -1;
    dae.updateMatrix();
    init();
} );

function init() {
    scene = new THREE.Scene();

    initMesh();
    initCamera();
    initLights();
    initRenderer();
    setTimeout(function() {

      animate();
    }, 100)

    document.body.appendChild(renderer.domElement);
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 10);
    camera.position.set(0, 3.5, 5);
    camera.lookAt(scene.position);
}


function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
}

function initLights() {
    var light = new THREE.AmbientLight(0xffffff);
    scene.add(light);
}

var mesh = null;
function initMesh() {
    var loader = new THREE.JSONLoader();
    loader.load('cube-animation-test.json', function(geometry, materials) {
        mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        // mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.75;
        // mesh.translation = geometry.center();

        mixer = new THREE.AnimationMixer( scene ) ;

        mixer.clipAction( geometry.animations[0], mesh )
            .setDuration( 1 )           // one second
            .startAt( - Math.random() ) // random phase (already running)
            .play();                    // let's go
        scene.add(mesh);
    });
    scene.add( dae );

}

function rotateMesh() {
    if (!mesh) {
        return;
    }

    mesh.rotation.x -= SPEED * 2;
    mesh.rotation.y -= SPEED;
    mesh.rotation.z -= SPEED * 3;
}

function render() {
    // requestAnimationFrame(render);
    // rotateMesh();
    renderer.render(scene, camera);
}



function animate() {
  requestAnimationFrame( animate );
  var delta = clock.getDelta();
  // animate Collada model
  THREE.AnimationHandler.update( delta );
  mixer.update( delta );
  render();
}