initScene();

function initScene() {
	
	var dayTime = true;
	var helpersOn = false;
    const daySceneColor = 0xc3d1cc;
	const nightSceneColor = 0x14242d;
    const roomColor = 0x227b93;
    const shapeColor = 0xff6c00;
	const lightColor = 0xffffff;
	const pointLightColor = 0xffb400;




    // Setup the renderer and canvas element.
	var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Setup the scene and camera.
	var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);

    // Set the initial position of the camera.
    camera.position.set(-10, 12, 40);
    camera.lookAt(scene.position);

	
	
	
	// Setup light sources.
	var ambientLight= new THREE.AmbientLight(lightColor);
	
	var spotLight = new THREE.SpotLight(lightColor);
	spotLight.position.set(20, 15, 20);
	spotLight.angle = Math.PI / 4;
	spotLight.decay = 5;
	spotLight.distance = 200;
	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	spotLight.shadow.radius = 2;
	spotLight.shadow.camera.near = 5;
	spotLight.shadow.camera.far = 50;

	var pointLight = new THREE.PointLight(pointLightColor, 1.5);
	pointLight.position.set(0, -0.5, 0);
	pointLight.castShadow = true;
	pointLight.shadow.mapSize.width = 1024;
	pointLight.shadow.mapSize.height = 1024;
	pointLight.shadow.radius = 20;
	
	// Enable shadows.
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	
	// Add light sources to scene.
	scene.add(ambientLight);
	scene.add(spotLight);
	
	// Setup light helpers.
	var spotLightHelper = new THREE.SpotLightHelper(spotLight);
	var spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
	var pointLightHelper = new THREE.PointLightHelper(pointLight);
	
	
	
	
	// Special settings for day vs night scenes.
	function setDayScene() {
		renderer.setClearColor(daySceneColor);
		ambientLight.intensity = 1;
		spotLight.intensity = 0.75;
		scene.remove(pointLight);
	}
	
	function setNightScene() {
		renderer.setClearColor(nightSceneColor);
		ambientLight.intensity = 0.5;
		spotLight.intensity = 0.5;
		scene.add(pointLight);
	}
	
	// Function to turn on/off helpers.
	function setHelpers() {
		if (helpersOn && dayTime) {
			scene.add(spotLightHelper);
			scene.add(spotLightCameraHelper);
			scene.remove(pointLightHelper);
		} else if (helpersOn && !dayTime) {
			scene.add(spotLightHelper);
			scene.add(spotLightCameraHelper);
			scene.add(pointLightHelper);	
		} else {
			scene.remove(spotLightHelper);
			scene.remove(spotLightCameraHelper);
			scene.remove(pointLightHelper);
		}
	}
	
	
	
			
	// Define the wood texture for the floor of the room.
	var woodTexture = new THREE.Texture(texture); // This comes from texture.data.js
	woodTexture.wrapS = THREE.RepeatWrapping;
	woodTexture.wrapT = THREE.RepeatWrapping;
	woodTexture.repeat.set(2, 2);
	woodTexture.needsUpdate = true;

	// Improve appearance of texture by setting anisotropy
	var maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
	woodTexture.anisotropy = maxAnisotropy;

    // Define the materials for the room. When viewing the room from straight on, these are the face colours.
    // THREE.DoubleSide renders the material on both the outside and inside of the room geometry.
    // The right, top and front faces are invisible, revealing the inside of the room.
    var materials = [
        new THREE.MeshLambertMaterial({ visible: false }),                                // right
        new THREE.MeshLambertMaterial({ color: roomColor, side: THREE.DoubleSide }),      // left
        new THREE.MeshLambertMaterial({ visible: false }),                                // top      
		new THREE.MeshLambertMaterial({ map: woodTexture, side: THREE.DoubleSide }),      // bottom
        new THREE.MeshLambertMaterial({ visible: false }),                                // front
        new THREE.MeshLambertMaterial({ color: roomColor, side: THREE.DoubleSide })       // back
    ];

    // Define the geometry and create the room.
    var geometry = new THREE.CubeGeometry(20, 15, 20, materials);
    var room = new THREE.Mesh(geometry, materials);
	room.receiveShadow = true;

	// Position the room.
	room.position.y = 3;
	room.rotation.y = -0.75;
	
	// Add the room to the scene.
    scene.add(room);




    // Define the material for the shape.
    var material = new THREE.MeshPhongMaterial({ color: shapeColor, side: THREE.DoubleSide });

    // Define the path for the shape.
    var plusPath = new THREE.Shape();
    plusPath.moveTo(0, 0.75);
    plusPath.lineTo(1, 1.75);
    plusPath.lineTo(1.75, 1);
	plusPath.lineTo(0.75, 0);
    plusPath.lineTo(1.75, -1);
	plusPath.lineTo(1, -1.75);
	plusPath.lineTo(0, -0.75);
	plusPath.lineTo(-1, -1.75);
	plusPath.lineTo(-1.75, -1);
	plusPath.lineTo(-0.75, 0);
	plusPath.lineTo(-1.75, 1);
	plusPath.lineTo(-1, 1.75);

    // Define the geometry and create the shape.
    var geometry = new THREE.ShapeGeometry(plusPath);
    var plus = new THREE.Mesh(geometry, material);
	plus.castShadow = true;
	
	// Move the shape right of centre and backward a bit.
	plus.position.set(2, 2, -2);

	// Add the shape to the scene.
    scene.add(plus);
	
	
	
	
	// HTML elements for event listeners and DOM interaction.
	var shapeRotationDirectionControl = document.getElementById('direction-control');
	var shapeRotationMotionControl = document.getElementById('motion-control');
	var shapeRotationSpeedControl = document.getElementById('speed-control');
	var shapeRotationStepValueText = document.getElementById('rotation-step-value-text');
	var sceneZoomControl = document.getElementById('scene-zoom-control');
	var sceneZoomValueText = document.getElementById('scene-zoom-value-text');
	var sceneRotationControl = document.getElementById('scene-rotation-control');
	var sceneToggleButton = document.getElementById('scene-toggle-button');
	var helpersToggleButton = document.getElementById('helpers-toggle-button');
	
	// Shape rotation settings and function.
	var shapeRotationStep = 0.06;
	var shapeIsRotating = true;
	
	function rotateShape(step) {
		plus.rotation.y += step;
	}
	
	// Rotation direction control event listener.
	shapeRotationDirectionControl.addEventListener('click', function(e) {
		if (e.target.className == 'clockwise')
			e.target.className = 'counter-clockwise';
		else
			e.target.className = 'clockwise';
		shapeRotationStep = -shapeRotationStep;
	});
	
    // Rotation speed control event listener and function.
	function updateRotationSpeed(e) {
		if (shapeRotationStep < 0) {
			shapeRotationStep = -e.target.value;
			shapeRotationStepValueText.innerHTML = -shapeRotationStep; // Always display a positive value for the rotation speed.
		}
		else {
			shapeRotationStep = +e.target.value;
			shapeRotationStepValueText.innerHTML = shapeRotationStep;
		}
	}
	
    shapeRotationSpeedControl.addEventListener('input', function(e) {
		updateRotationSpeed(e);
    });
	
	// Rotation motion control event listener.
	shapeRotationMotionControl.addEventListener('click', function(e) {
		if (shapeIsRotating)
			e.target.className = 'start';
		else
			e.target.className = 'stop';
		shapeIsRotating = !shapeIsRotating;
	});
	
	// Scene zoom setting and control event listener and function.
	var zoomLevel = 1;
	
	function updateZoomLevel(e) {
		zoomLevel = e.target.value;
		camera.zoom = zoomLevel;
		camera.updateProjectionMatrix();
		sceneZoomValueText.innerHTML = zoomLevel + 'x';
	}
	
    sceneZoomControl.addEventListener('input', function(e) {
		updateZoomLevel(e);
    });
	
    
	
	// Scene camera position control event listener and function.
	var cameraXPos = -10;
	
	function updateCameraPosition(e) {
		camera.position.x = e.target.value;
		camera.lookAt(scene.position);
	}
	
	sceneRotationControl.addEventListener('input', function(e) {
		updateCameraPosition(e);
	});
	
	// Scene toggle event listener.
	sceneToggleButton.addEventListener('click', function(e) {
		dayTime = !dayTime;
	});
	
	// Helpers toggle event listener.
	helpersToggleButton.addEventListener('click', function(e) {
		helpersOn = !helpersOn;
	});
	
	
	
	
	// Some IE versions needs the onChange event instead of onInput, so this is a fix for IE10 and IE11.
	if (navigator.appVersion.indexOf("MSIE 10") !== -1 || (navigator.userAgent.indexOf("Trident") !== -1 && navigator.userAgent.indexOf("rv:11") !== -1)) {
		sceneZoomControl.addEventListener('change', function(e) {
			updateZoomLevel(e);
		});
		
		sceneRotationControl.addEventListener('change', function(e) {
			updateCameraPosition(e);
		});
	
		shapeRotationSpeedControl.addEventListener('change', function(e) {
			updateRotationSpeed(e);
		});
	}
	
    
	
    
	// Render the scene.
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
		rotateShape(shapeIsRotating ? shapeRotationStep : 0);
		dayTime ? setDayScene() : setNightScene();
		setHelpers();
    }
    animate();
	
	
	
	
	// Set the initial slider values and text on screen.
	shapeRotationSpeedControl.value = shapeRotationStep;
	shapeRotationStepValueText.innerHTML = shapeRotationStep;
	sceneZoomControl.value = zoomLevel;
	sceneZoomValueText.innerHTML = zoomLevel + 'x';
	sceneRotationControl.value = cameraXPos;




    // Update the canvas size and aspect ratio on window resize.
    window.addEventListener('resize', function() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
	
}
