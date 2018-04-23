var util = (function () {				
	function randomColor() {
		return new THREE.Color(Math.random() * 0xffffff);
	}
	
	function randInRange(min, max) {
		return Math.random() * (max - min) + min;
	}
	
	function randElement(arr) {
		return arr[Math.floor(randInRange(0, arr.length - 1))];
	}
	
	function removeEl(arr, el) {
		var i = arr.indexOf(el);
		if (i > -1) arr.splice(i, 1);
	}
	
	function ready(fn) {
	  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
		fn();
	  } else {
		document.addEventListener('DOMContentLoaded', fn);
	  }
	}
	
	return {
		randomColor: randomColor,
		randInRange: randInRange,
		randElement: randElement,
		removeEl:    removeEl,
		ready:       ready,
	};
})();

var particles = (function () {
	var modeId = 0;
	function ParticleMode(name, setup, animate) {
		this.id = modeId++;
		this.name = name;
		this.setup = setup;
		this.animate = animate;
	}
	
	var snowFlakes;
	function _setupSnow(minV, maxV) {
		snowFlakes = [];
		for (var i = 0; i < starGeometry.vertices.length; i++) {
			snowFlakes.push({
				vec: starGeometry.vertices[i],
				vy: util.randInRange(minV, maxV), // Velocity
			});
		}
	}
	
	function setupSlowSnow() {
		_setupSnow(-4, -1);
	}
	
	function isOverflown(vec) {
		return vec.x < -1000 
		 || vec.x > 1500
		 || vec.y < -1000 
		 || vec.y > 1500
		 || vec.z < -2000 
		 || vec.z > -100;
	}
	
	function snowAnimate() {
		// Snowflakes 
		snowFlakes.forEach(function (flake) {
			flake.vec.x += util.randInRange(-1, 1);
			flake.vec.y += flake.vy;
			
			// If we went to far, put it back to a random place on the screen
			if (isOverflown(flake.vec)) {
				randomlyPosition(flake.vec);
				
				// Manually set the y value to the TOP of the screen (approximately)
				flake.vec.y = 1500;
			}
		});
		
		starGeometry.verticesNeedUpdate = true;
	}
	
	function randomlyPosition(vec) {
		// Position a star
		vec.x = util.randInRange(-1000, 1500);
		vec.y = util.randInRange(-1000, 1500);
		vec.z = util.randInRange(-2000, -100);
	}
	
	var starGeometry;
	function render(scene) {
		// Create the geometry.
		starGeometry = new THREE.Geometry();
		var starMaterial = new THREE.PointsMaterial({ opacity: 0.3 });

		// Create a LOT of stars
		for (var i = 0; i < 50000; i++) {		
			var singleStar = new THREE.Vector3();
			randomlyPosition(singleStar);
			starGeometry.vertices.push(singleStar);
		}

		// Create the Points container for all the stars and add it to the scene
		var particles = new THREE.Points(starGeometry, starMaterial);
		particles.sortParticles = true;
		scene.add(particles);
		
		// Initialize to the first mode!
		currMode = modes[0];
		currMode.setup();
	}
	
	// Setup all all of our modes
	//  NOTE: other modes removed for this site, since only this one is used here.
	var modes = [
		new ParticleMode("Slow Snow", setupSlowSnow, snowAnimate),
	];
	var currMode;

	
	return {
		next: function () { 
			// Move to the next mode 
			currMode = modes[(currMode.id + 1) % modes.length]; 
			currMode.setup();
			return currMode.name;
		},
		animate: function () { 
			// Just animate the current mode!
			currMode.animate(); 
		},
		render: render
	};
})();

//Main initialization
util.ready(function () {
	// Create the scene
	var scene = new THREE.Scene({antialias:true});
	scene.fog = new THREE.FogExp2( 0x000000, 0.1 );

	// Setup camera
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
	camera.position.set(4, 2, 5);

	// Setup Renderer
	var renderer = new THREE.WebGLRenderer({alpha: true});
	renderer.setClearColor(0x000011, 1);
	renderer.setSize( window.innerWidth, window.innerHeight );
	
	// Render all of the sub-scenes
	particles.render(scene);
	
	var light = new THREE.PointLight(0xffffff, 2);
	light.position.set(3, 4, 2);
	scene.add(light);
	
	// Render and put into DOM
	renderer.render(scene, camera);
	document.body.appendChild( renderer.domElement );
	
	// Init animation
	(function animate() {
		requestAnimationFrame(animate);
		
		// Call all animators
		particles.animate();
		
		// Rerender
		renderer.render(scene, camera);
	})();
	
	// Handle window resize
	window.addEventListener("resize", function () { 
		renderer.setSize( window.innerWidth, window.innerHeight );
		camera.aspect = window.innerWidth/window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.render(scene, camera);
	});
});