$(function(){
    var scene=new THREE.Scene();
    var camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
    var renderer=new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE,1.0));
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMapEnabled=true;

    var groundGeom=new THREE.PlaneGeometry(100,100,4,4);
    var groundMesh=new THREE.Mesh(groundGeom,new THREE.MeshLambertMaterial({color:0xffffff}));
    groundMesh.rotation.x=-Math.PI/2;
    groundMesh.position.y=-20;
    scene.add(groundMesh);

    var sphereGometry=new THREE.SphereGeometry(14,20,20);
    var cubeGeometry=new THREE.BoxGeometry(15,15,15);
    var planeGeometry=new THREE.PlaneGeometry(14,14,4,4);

    var meshMaterial=new THREE.MeshBasicMaterial({color:0x7777ff});

    var sphere=new THREE.Mesh(sphereGometry,meshMaterial);
    var cube=new THREE.Mesh(cubeGeometry,meshMaterial);
    var plane=new THREE.Mesh(planeGeometry,meshMaterial);

    sphere.position.x=0;
    sphere.position.y=3;
    sphere.position.z=2;

    cube.position=sphere.position;
    plane.position=sphere.position;
    scene.add(cube);

    camera.position.x=-20;
    camera.position.y=50;
    camera.position.z=40;
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    var ambientLight=new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    var spotLight=new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40,60,-10);
    spotLight.castShadow=true;
    scene.add(spotLight);

    document.getElementById("WebGL-output").appendChild(renderer.domElement);
    var step=0;
    var oldContext=null;
    var controls=new function(){
        this.opacity=meshMaterial.opacity;
        this.wireframe=meshMaterial.wireframe;
        this.visible=meshMaterial.visible;
    }
    var gui=new dat.GUI();
    var spGui=gui.addFolder("Mesh");
    spGui.add(controls,'opacity',0,1).onChange(function(e){
        meshMaterial.opacity=e;
    });
    spGui.add(controls,'wireframe').onChange(function(e){
        meshMaterial.wireframe=e;
    });
    spGui.add(controls,'visible').onChange(function(e){
        meshMaterial.visible=e;
    })

    render();
    function render(){
        cube.rotation.y = step += 0.01;
        plane.rotation.y=step;
        sphere.rotation.y=step;
        requestAnimationFrame(render);
        renderer.render(scene,camera);
    }
})