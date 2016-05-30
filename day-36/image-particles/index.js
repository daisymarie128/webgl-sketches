/* ----------------------------


		threejs shader boilerplate
		making an image out of particles
    awesome repo from https://github.com/sjkim24/morphingparticles
    most of the code here is thanks to that repo


		------------------------------------ */

var container,
    canvas;
var camera,
    scene,
    renderer,
    dispersed = false,
    particles,
    particleMaterial,
    particleCount = 5000,
    particleSystem,
    image,
    rgbData = [];

init();
animate();

function init() {
    container = document.getElementById('container');
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10000);
    camera.position.z = 1000;
    scene = new THREE.Scene();

    // make some geometry which will hold our particles
    particles = new THREE.Geometry();
    particleMaterial = new THREE.PointsMaterial({
      size: 15,
      map: new THREE.TextureLoader().load("particle.png"),
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    createParticles();
    loadImage();

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    container.appendChild( renderer.domElement );
    onWindowResize();
    window.addEventListener( 'resize', onWindowResize, false );
}

// this is where i will load my images
function loadImage() {
  image = new Image();
  image.addEventListener("load", function() {
    drawImage(this, rgbData);
  }, false);
  image.src = "hello.png";
}

// this is where I will draw the images to the canvas to get color values
function drawImage(imageObj, dataArray) {
  canvas = document.getElementById('canvas');
  var context = canvas.getContext("2d");
  var imageWidth = imageObj.width;
  var imageHeight = imageObj.height;
  context.drawImage(imageObj, 0, 0);
  var imageData = context.getImageData(0, 0, imageWidth, imageHeight);
  var data = imageData.data;

  // not really understanding why in canvas you time it by 4
  // Uint8ClampedArray ... 4 bytes of data?
  for(var y = 0; y < imageHeight; y += 4) {
    for(var x = 0; x < imageWidth; x += 4) {
      var red = data[(((imageWidth * 4) * y) + x * 4)];
      var green = data[(((imageWidth * 4) * y) + x * 4) + 1];
      var blue = data[(((imageWidth * 4) * y) + x * 4)  + 2];
      var alpha = data[(((imageWidth * 4) * y) + x * 4) + 3];
      if (blue > 100) {
        var pX = (x % 500) - 249;
        var pY = 249 - y;
        dataArray.push([pX, pY, red, green, blue, alpha]);
      }
    }
  }

}

// this is what will draw the particles into the images place
var makeImg = function(rgba) {
  var imageParticles = particles.vertices.slice(0, rgba.length);
  var outerParticles = particles.vertices.slice(rgba.length, particleCount);

  morphImageParticles(imageParticles, rgba);
  morphOuterParticles(outerParticles);
};

// this is where i fill create particles
function createParticles() {
  for (var i = 0; i < particleCount; i++) {
    var x = getRandomInt(-1000, 1000);
    var y = getRandomInt(-600, 1500)
    var z = Math.random() * 30 - 15;
    var particle = new THREE.Vector3(x, y, z);
    particle.updated = 0;
    particles.vertices.push(particle);
  };

  particleSystem = new THREE.Points(particles, particleMaterial);
  particleSystem.sortParticles = true;
  scene.add(particleSystem);
}

function resetProperties() {
  var count = particleCount;
  while (count--) {
    var particle = particles.vertices[count];
    particle.destination = null
    particle.updated = 0;
  };
};

var morphImageParticles = function(imageParticles, rgba) {
  for (var i = 0; i < imageParticles.length; i++) {
    var particle = imageParticles[i]
    if (particle.destination === null) {
      console.log('null??')
      var pixelData = rgba[i];
      var x = pixelData[0];
      var y = pixelData[1];
      var z = Math.random() * 30 - 15;
      addDestination(particle, x, y, z);
      addVelocity(particle);
    }
    if (particle.updated <= 180) {
      move(particle);
    }
  }
};

var morphOuterParticles = function(outerParticles) {
  for (var i = 0; i < outerParticles.length; i++) {
    var nums = [-1, 1];
    var particle = outerParticles[i];
    if (particle.destination === null) {
      var x = Math.random() * 1000 - 500;
      var y = Math.random() * 1000 - 500;
      var z;
      if (i <= Math.round(outerParticles.length * 0.6)) { // first 60%
        z = distributedZ(1)
      } else if (i > Math.round(outerParticles.length * 0.6) && i < Math.round(outerParticles.length * 0.9)) { // between 60% and 90%
        z = distributedZ(2)
      } else { // rest of 10%
        z = distributedZ(3);
      }
      addDestination(particle, x, y, z);
      addVelocity(particle);
    }

    if (particle.updated <= 600) {
      move(particle);
      slowDown(particle);
    } else {
      particles.vertices = shuffle(particles.vertices);
      resetProperties();
      return;
    }
  }
};


// this is what will start the particles off
function disperse() {
  for (var i = 0; i < particleCount; i++) {
    var particle = particles.vertices[i];
    if (typeof(particle.destination) === "undefined") {
      var nums = [-1, 1];
      var x = particle.x + nums[Math.round(Math.random())];
      var y = particle.y - 1000;
      var z = Math.random() * 30 - 15;
      addDestination(particle, x, y, z);
      particle.velocity = new THREE.Vector3(x - particle.x, -3, z - particle.z);
    }

    if (particle.updated <= 300) {
      move(particle);
    } else {
      particles.vertices = shuffle(particles.vertices);
      resetProperties();
      dispersed = true;
      return;
    }
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// generate some random values for our shuffling
var distributedZ = function(level) {
  var z;
  if (level === 1) {
    z = getRandomInt(50, 100);
  } else if (level === 2) {
    z = getRandomInt(350, 400);
  } else {
    z = getRandomInt(650, 700);
  }
  return z;
};

// this is what will scramble the image after a few seconds
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

function addDestination(particle, x, y, z) {
  var dest = new THREE.Vector3(x, y, z);
  particle.destination = dest;
};

function addVelocity(particle) {
  var xDiff = (particle.destination.x - particle.x) / 180;
  var yDiff = (particle.destination.y - particle.y) / 180;
  var zDiff = (particle.destination.z - particle.z) / 180;
  var vel = new THREE.Vector3(xDiff, yDiff, zDiff);
  particle.velocity = vel;
};

// function to move our particless
function move(particle) {
  particle.x += particle.velocity.x;
  particle.y += particle.velocity.y;
  particle.z += particle.velocity.z;
  particle.updated += 1;
};

// function to slow our particles
function slowDown(particle) {
  particle.velocity.x -= (particle.velocity.x / 300)
  particle.velocity.y -= (particle.velocity.y / 300)
  particle.velocity.z -= (particle.velocity.z / 300)
};

function onWindowResize( event ) {
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
  if (dispersed) {
    makeImg(rgbData);
  } else {

    // this is for dropping the particles down in the begginning
    disperse();
  }
  particleSystem.geometry.verticesNeedUpdate = true;

  requestAnimationFrame(animate);
  render();
}

function render() {
    renderer.render( scene, camera );
}
