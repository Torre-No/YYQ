$(function(){
   var scene=new THREE.Scene();
   var camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
   var webGLRenderer=new THREE.WebGLRenderer();
   webGLRenderer.setClearColor(new THREE.Color(0xffffff,1.0));
   webGLRenderer.setSize(window.innerWidth,window.innerHeight);
   webGLRenderer.shadowMapEnabled=true;

   camera.position.x=-30;
   camera.position.y=40;
   camera.position.z=50;
   camera.lookAt(new THREE.Vector3(0,0,0));

   document.getElementById("WebGL-output").appendChild(webGLRenderer.domElement);
   var step=0;
   var controls=new function(){
       this.loadCube=function(){
           var loader=new THREE.OBJLoader();
           loader.load('./animation/UVCube1.obj',function(geometry){
               if(mesh)scene.remove(mesh);
               var material=new THREE.MeshBasicMaterial({color:0xffffff});
               var texture=THREE.ImageUtils.loadTexture("./animation/ash_uvgrid01.jpg");
               material.map=texture;
               geometry.children[0].material=material;
               mesh=geometry;
               geometry.scale.set(15,15,15);
               scene.add(geometry);
           })
       }
   };

   var gui=new dat.GUI();
   gui.add(controls,'loadCube');
   var mesh;
   controls.loadCube();
   render();
   function render(){
       if(mesh){
           mesh.rotation.y+=0.006;
           mesh.rotation.x+=0.006;
       }
       requestAnimationFrame(render);
       webGLRenderer.render(scene,camera);
   }
})