/* ----------------------------
		

		threejs shader
    trying to figure out how to animate my fragment shaders better
    currently a WIP
    material wrapping and load times are giving me some trouble ATM
    will fix this stuff later


		------------------------------------ */


      var container, stats;

      var clock = new THREE.Clock();

      var camera, scene, renderer, composer;

      var uniforms, material, mesh;

      var mouseX = 0, mouseY = 0,
      lat = 0, lon = 0, phy = 0, theta = 0;

      var width = window.innerWidth || 2;
      var height = window.innerHeight || 2;

      var windowHalfX = width / 2;
      var windowHalfY = height / 2;

      init();
      animate();

      function init() {

        container = document.getElementById( 'container' );

        camera = new THREE.PerspectiveCamera( 35, windowHalfX / windowHalfY, 1, 3000 );
        camera.position.z = 4;

        scene = new THREE.Scene();

        var textureLoader = new THREE.TextureLoader();

        uniforms = {

          fogDensity: { type: "f", value: 0.45 },
          fogColor: { type: "v3", value: new THREE.Vector3( 0, 0, 0 ) },
          time: { type: "f", value: 1.0 },
          resolution: { type: "v2", value: new THREE.Vector2() },
          uvScale: { type: "v2", value: new THREE.Vector2( 3.0, 1.0 ) },
          texture1: { type: "t", value: textureLoader.load( "cloud.png" ) },
          texture2: { type: "t", value: textureLoader.load( "sky.png" ) }

        };

        // uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
        // uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.RepeatWrapping;
        uniforms.texture1.value.wrapS = THREE.MirroredRepeatWrapping;
        uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
        uniforms.texture2.value.wrapS = THREE.MirroredRepeatWrapping;
        uniforms.texture1.value.wrapT = THREE.RepeatWrapping;

        var size = 0.65;

        material = new THREE.ShaderMaterial( {

          uniforms: uniforms,
          vertexShader: document.getElementById( 'vertexshader' ).textContent,
          fragmentShader: document.getElementById( 'fragmentshader' ).textContent

        } );

        mesh = new THREE.Mesh( geometry = new THREE.SphereGeometry( 0.6, 50, 50 ), material );
        mesh.rotation.x = 0.3;
        scene.add( mesh );

        var blue = new THREE.Color( "#29B6F6" );
        var white = new THREE.Color( "#fff" );
        var darkGrey = new THREE.Color( "#212121" );
        var teal = new THREE.Color( "#455A64" );
        var light = new THREE.DirectionalLight( blue, 10.5 );
        var light2 = new THREE.DirectionalLight( white, 10 );
        light2.position.set( -2, -3, 1 );
        light.position.set( 1, 1, 1 );


        scene.add(light2)
        scene.add(light)

        scene.add( new THREE.HemisphereLight( darkGrey, teal ) );

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        // renderer.setClearColor(0xffffff, 1);
        renderer.setPixelRatio( window.devicePixelRatio );
        container.appendChild( renderer.domElement );
        // renderer.autoClear = false;

        onWindowResize();

        window.addEventListener( 'resize', onWindowResize, false );

      }

      function onWindowResize( event ) {

        uniforms.resolution.value.x = window.innerWidth;
        uniforms.resolution.value.y = window.innerHeight;

        renderer.setSize( window.innerWidth, window.innerHeight );

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        // composer.reset();

      }

      //

      function animate() {

        requestAnimationFrame( animate );

        render();

      }

      function render() {

        var delta = 5 * clock.getDelta();

        uniforms.time.value += 0.2 * delta;

        mesh.rotation.y += 0.0125 * delta;
        mesh.rotation.x += 0.05 * delta;

        // renderer.clear();
        renderer.render( scene, camera );

      }
