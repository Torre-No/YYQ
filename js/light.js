$(function(){
    var scene=new THREE.Scene();
    var camera=new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer=new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE,1.0));
    renderer.setSize(window.innerWidth,window.innerHeight);

    var planeGeometry=new THREE.PlaneGeometry(60,20,20,20);
    var planeMaterial=new THREE.MeshLambertMaterial({color:0xffffff});
    var plane=new THREE.Mesh(planeGeometry,planeMaterial);
    plane.receiveShadow=true;

    plane.rotation.x=-0.5*Math.PI;
    plane.position.x=15;
    plane.position.y=0;
    plane.position.z=0;
    scene.add(plane);

    var cubeGeometry=new THREE.BoxGeometry(4,4,4);
    var cubeMaterial=new THREE.MeshLambertMaterial({color:0xff7777});
    var cube=new THREE.Mesh(cubeGeometry,cubeMaterial);
    cube.castShadow=true;
    cube.position.x=-4;
    cube.position.y=3;
    cube.position.z=0;
    scene.add(cube);

    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    sphere.position.x = 20;
    sphere.position.y = 0;
    sphere.position.z = 2;
    sphere.castShadow = true;

    scene.add(sphere);

    camera.position.x = -25;
    camera.position.y = 30;
    camera.position.z = 25;
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    var ambiColor = "#0c0c0c";
    var ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add( spotLight );

    var pointColor = "#ccffcc";
    var pointLight = new THREE.PointLight(pointColor);
    pointLight.distance = 100;
    scene.add(pointLight);

    var sphereLight=new THREE.SphereGeometry(0.2);
    var sphereLightMatrial=new THREE.MeshLambertMaterial({color:0xac6c25});
    var sphereLightMesh=new THREE.Mesh(sphereLight,sphereMaterial);
    sphereLightMesh.castShadow=true;

    sphereLightMesh.position = new THREE.Vector3(3, 0, 3);
    scene.add(sphereLightMesh);

    // add the output of the renderer to the html element
    document.getElementById("WebGL-output").appendChild(renderer.domElement);

    var step = 0;

    // used to determine the switch point for the light animation
    var invert = 1;
    var phase = 0;

    var controls = new function () {
        this.rotationSpeed = 0.03;
        this.bouncingSpeed = 0.03;
        this.ambientColor = ambiColor;
        this.pointColor = pointColor;
        this.intensity = 1;
        this.distance = 100;
    };

    var gui = new dat.GUI();
    gui.addColor(controls, 'ambientColor').onChange(function (e) {
        ambientLight.color = new THREE.Color(e);
    });

    gui.addColor(controls, 'pointColor').onChange(function (e) {
        pointLight.color = new THREE.Color(e);
    });

    gui.add(controls, 'intensity', 0, 3).onChange(function (e) {
        pointLight.intensity = e;
    });

    gui.add(controls, 'distance', 0, 100).onChange(function (e) {
        pointLight.distance = e;
    });

    render();

    function render() {
        
        // rotate the cube around its axes
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        // bounce the sphere up and down
        step += controls.bouncingSpeed;
        sphere.position.x = 20 + ( 10 * (Math.cos(step)));
        sphere.position.y = 2 + ( 10 * Math.abs(Math.sin(step)));

        // move the light simulation
        if (phase > 2 * Math.PI) {
            invert = invert * -1;
            phase -= 2 * Math.PI;
        } else {
            phase += controls.rotationSpeed;
        }

        sphereLightMesh.position.z = +(7 * (Math.sin(phase)));
        sphereLightMesh.position.x = +(14 * (Math.cos(phase)));
        sphereLightMesh.position.y = 5;

        if (invert < 0) {
            var pivot = 14;
            sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot;
        }

        pointLight.position.copy(sphereLightMesh.position);

        // render using requestAnimationFrame
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
})