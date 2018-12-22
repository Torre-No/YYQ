var box,action,allDuration;
$(function(){
    // var stats=initStats();

    var scene=new THREE.Scene();
    var camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
    var webGLRenderer=new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(new THREE.Color(0xa0a0a0,1.0));
    webGLRenderer.setSize(window.innerWidth,window.innerHeight);
    webGLRenderer.shadowMapEnabled=true;

    camera.position.x=30;
    camera.position.y=108;
    camera.position.z=65;

    var Light=new THREE.HemisphereLight(0xffffff,0x444444);
    Light.position.set(0,200,0);
    Light.intensity=1;
    scene.add(Light);   //设置半球光,并添加进去

    var DligthColor=0xffffff;
    var Dligth=new THREE.DirectionalLight(DligthColor,1);
    Dligth.position.set(0,200,100);
    Dligth.castShadow=true;

    Dligth.shadow.camera.top=180;
    Dligth.shadow.camera.bottom=-100;
    Dligth.shadow.camera.left=-120;
    Dligth.shadow.camera.right=120;

    Dligth.shadow.mapSize.width=2048;
    Dligth.shadow.mapSize.height=2048;
    scene.add(Dligth);   //设置平行光,并添加进去
    document.getElementById("WebGL-output").appendChild(webGLRenderer.domElement);

    var clock=new THREE.Clock();  //设置时钟;
    // var c=new THREE.OrbitControls(camera,document.querySelector("#cc"));
    // c.update();

    var timerLayer;
    var fbx_loader=new THREE.FBXLoader();
    fbx_loader.load('./animation/Dying.fbx',function(object){
        object.mixer=new THREE.AnimationMixer(object);//动画播放器处理模型动画
        console.log(object);

        var animation=object.animations[0];//动画
        allDuration=animation.duration;//动画时长
        timerLayer=allDuration/animation.tracks.length; //总时长除以动画轨迹数组
        action=object.mixer.clipAction(animation); //关键帧轨迹

        object.traverse(function(e){
            if(e.isMesh){
                e.castShadow=true; //允许模型本身对自己产生阴影
                e.receiveShadow=true;//接受阴影渲染
            }
        })
        box=object;
        scene.add(box);

        domClick()
    });

    var controls=new function(){
        this.perspective="Perspective";
        this.switchCamera=function(){
            if(camera instanceof THREE.PerspectiveCamera){
                camera =new THREE.OrthographicCamera(window.innerWidth/-16, window.innerWidth/16, window.innerHeight/16, window.innerHeight/-16, -200, 500);
                camera.position.set(120,60,180);
                camera.lookAt(scene.position);
                this.perspective="Orthographic";
            }else{
                camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
                camera.position.set(120,60,180);
                camera.lookAt(scene.position);
                this.perspective="perspective";
            }
        }
        this.DligthColor=DligthColor;
    }

    function addControls(x,y,z){
        var tt=new function(){
            this.x=x;
            this.y=y;
            this.z=z;
            camera.position.set(x,y,z);
            camera.lookAt(scene.position);
        };
        return tt;
    }

    var controlsposition=[];
    controlsposition.push(addControls(30,108,65));

    var gui=new dat.GUI();
    gui.add(controls,"switchCamera");
    gui.add(controls,'perspective').listen();
    var f1=gui.addFolder("CameraPosition");
    f1.add(controlsposition[0],'x',0,360);
    f1.add(controlsposition[0],'y',0,360);
    f1.add(controlsposition[0],'z',0,360);
    gui.addColor(controls,"DligthColor").onChange(function(e){
        Dligth.color=new THREE.Color(e);
    });

    render();

    function render(){
        requestAnimationFrame(render);

        camera.position.set(controlsposition[0].x,controlsposition[0].y,controlsposition[0].z);
        camera.lookAt(scene.position);

        if(box){
            box.mixer.update(clock.getDelta());//判断模型加载后，进行动画渲染
        }

        webGLRenderer.render(scene,camera);
    }

})

function domClick(){
    document.querySelector("#tack").addEventListener("click",function(){
        action.reset().play()  //执行动画重置功能
        var timer;
        if(timer){
            clearTimeout(timer);
        }

        timer=setTimeout(function(){
            action.paused=true
        },allDuration*1000-100)
    })

}