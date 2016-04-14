/* ----------------------------
		

		threejs shader boilerplate


		------------------------------------ */


var container,
    camera, 
    scene, 
    renderer,
    composer, 
    color, 
    geometry,
    material,
    amount,
    cooordinates,
    object, 
    light;
var uniforms;

init();
animate();

function updateOptions() {
  var wildGlitch = document.getElementById('wildGlitch');
  glitchPass.goWild=wildGlitch.checked;
}

function init() {
    
  // set up my sphere coordinates
  cooordinates = [
    {
      x: -30,
      y: 20,
      z: 25
    },
    {
      x: 100,
      y: 20,
      z: 30
    },
    {
      x: 5,
      y: -60,
      z: 20
    },
    {
      x: 30,
      y: -170,
      z: 10
    },
    {
      x: 160,
      y: 160,
      z: -5
    },
    {
      x: 15,
      y: 100,
      z: 15
    }
  ];





    
    container = document.getElementById( 'container' );
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100000 );
    camera.position.z = 400;
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x000000, 1, 1000 );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    object = new THREE.Object3D();
    scene.add( object );

    // this is the amount of spheres we want
    color = new THREE.Color( 0xff0000 );
    geometry = new THREE.SphereGeometry( 70, 100, 100 );

    // Lights
    // var ambient = new THREE.AmbientLight( 0x101010 );
    // scene.add( ambient );
    // directionalLight = new THREE.DirectionalLight( 0xffffff );
    // directionalLight.position.set( 0, -70, 100 ).normalize();

    scene.add( new THREE.AmbientLight( 0x222222 ) );
    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 );
    scene.add( light );

    // var bumpTexture = new THREE.TextureLoader().load( "white-corss-hatch.jpg" );
    var bumpTexture = new THREE.TextureLoader().load( "water-texture.jpg" );
    // bumpTexture = new THREE.TextureLoader().load( "clay.jpg" );
    // colorTexture = new THREE.TextureLoader().load( "clay.jpg" );
    // colorTexture = new THREE.TextureLoader().load( "white-corss-hatch.jpg" );
    colorTexture = new THREE.TextureLoader().load( "matcap-black-blue.png" );
    // colorTexture = new THREE.TextureLoader().load( "black-wash.jpg" );
    // colorTexture = new THREE.TextureLoader().load( "black-bump.png" );
    // bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping;
    
    // gets rid of the obvious cuts and edges of texture
    // colorTexture.wrapS = THREE.MirroredRepeatWrapping;
    // colorTexture.wrapT = THREE.MirroredRepeatWrapping;
    // colorTexture.repeat.set( 20, 20 );

    uniforms = {
        u_time: { type: "f", value: 1.0 },
        u_resolution: { type: "v2", value: new THREE.Vector2() },
        u_mouse: { type: "v2", value: new THREE.Vector2() },
        colorMap: {type: "t", value: colorTexture},
        bumpTexture: {type: "t", value: bumpTexture}
    };

    var material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent
    } );

    material.uniforms.colorMap.value.wrapS = THREE.ClampToEdgeWrapping;
    material.uniforms.colorMap.value.wrapT = THREE.ClampToEdgeWrapping;
    

    sphere = new THREE.Mesh( geometry, material );

    for (var i = 0; i < cooordinates.length; i++) {

        var clone = sphere.clone();
        clone.position.x = cooordinates[i].x;
        clone.position.y = cooordinates[i].y;
        clone.position.z = cooordinates[i].z;
        clone.rotation.x = cooordinates[i].x;
        clone.rotation.z = cooordinates[i].z;
        var scale = clone.position.z / 50 * 3.0;
        clone.scale.set( scale, scale, scale );

        scene.add( clone );
    };

    renderer.setClearColor(0xffffff, 1);

    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( scene, camera ) );
    glitchPass = new THREE.GlitchPass();
    glitchPass.renderToScreen = true;
    composer.addPass( glitchPass );

    document.body.appendChild( renderer.domElement );
}

function onWindowResize( event ) {
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function counter() {
    uniforms.u_time.value -= 0.005;
    console.log('reset')
}
var direction = 'up';
function animate() {
    if (direction == 'down') {
        if (uniforms.u_time.value <= 0) {
            direction = 'up';
            console.log('go up now')
        }
        uniforms.u_time.value -= 0.05;
    } else if (direction == 'up') {
        if (uniforms.u_time.value > 30) {
            direction = 'down';
            console.log('go down now')
        }
        uniforms.u_time.value += 0.05;
    }
    uniforms.u_resolution.value.x = renderer.domElement.width;
    uniforms.u_resolution.value.y = renderer.domElement.height;

    for (var i = 0; i < scene.children.length; i++) {
        scene.children[i].rotation.x += 0.005;
        scene.children[i].rotation.y += 0.005;
    };
    requestAnimationFrame( animate );
    render();
}

function render() {
    composer.render();
    // renderer.render( scene, camera );
}


