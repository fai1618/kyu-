// set stats
// 左上に表示するようCSSを記述してbody直下に表示
  var stats = new Stats();//FPS表示
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.right = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);


var ThreeRender = function(){
    var self = this;

    this.scene = new THREE.Scene();

    this.windowWidth = $(window).width();
    this.windowHeight = $(window).height();

// レンダラー追加 ----------------------------------------
    this.renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    this.renderer.domElement.id = "threejs";
    this.renderer.setSize(this.windowWidth, this.windowHeight); // canvasのサイズ設定
    this.renderer.autoClear = false;
    $("body").append(this.renderer.domElement);


//カメラ作成--------------------------------------------
    // camera 1
    this.cameras = {};
    this.cameras.first = new CameraMaker(0,200,0);
    this.cameras.first.init();
    THREEx.WindowResize(this.renderer, this.cameras.first.camera);
    // camera 2
    this.cameras.second = new CameraMaker(200,200,0);
    this.cameras.second.init(this.renderer);
    THREEx.WindowResize(this.renderer, this.cameras.second.camera);


//オブジェクト------------------------------------------------
    this.objs = {
        sphere : new SphereMaker({color:0x0088ff,radius:50}),
        light : new THREE.DirectionalLight(0x0000ff),
        circles:[],
        boxes:[]
    };

    var circleColor8 = [0xffffff,0xffff00,0xff00ff,0x00ffff,0xff0000,0x0000ff,0x00ff00,0x888888];
    for(var i =0;i<= 7;i++){
        this.objs.circles[i] = new CircleMaker(circleColor8[i],false,20,32);

        this.scene.add(this.objs.circles[i].mesh);
    }


/*    for(var i=0;i<=7;i++){
        this.objs.boxes[i] = new BoxMaker(circleColor8[i],false,10,10,1);
        this.scene.add(this.objs.boxes[i].mesh);
        this.objs.boxes[i].mesh.position.set(i*10,0,0);
    }*/

    this.scene.add( this.objs.sphere.mesh );

    //light
    this.objs.light.position.set(1, 1, 1).normalize();
    this.scene.add( this.objs.light );
    var amblight = new THREE.AmbientLight(0x00ffff);//環境光(すべての方向に光をあてる)
    amblight.color.multiplyScalar(0.5);//強さを0.5に
    //this.scene.add( amblight );



    this.time = 0;
    this.omega = 2*Math.PI/600/5;//角速度


};//ThreeRender

// レンダリング ----------------------------------------
//ThreeRender.prototype.constructor = ThreeRender;
ThreeRender.prototype.render = function() {
        stats.begin();

    var theta = this.omega*this.time;
    //sphereの自転
    this.objs.sphere.mesh.rotation.y = theta;

    for(var i=0;i<=7;i++){
        //circlesの原点中心の円運動
        this.objs.circles[i].circularMotion(100,this.omega*(this.time+i*75*5),this.objs.sphere.mesh.position);
    }


    /*for(var i=0;i<=7;i++){
        //boxesの原点中心の円運動
        this.objs.boxes[i].circularMotion(70,this.omega*(this.time+i*75*5),this.objs.sphere.mesh.position);
    }*/

    //rendererの分割
    ThreeRender.prototype.renderSet([this.cameras.first.camera,this.cameras.second.camera],this.renderer,this.scene);


    stats.end();
    this.time = window.requestAnimationFrame(this.render.bind(this));

};//prototype.render

ThreeRender.prototype.renderSet = function(cameras,renderer,scene){//cameras = [camera,camera2,camera3,....];
    var camerasCount = cameras.length;
    var width = $("#"+renderer.domElement.id).width();
    var height =$("#"+renderer.domElement.id).height();

    //var width = $(window).width();
    //var height =$(window).height();
    for(var i=0;i<camerasCount;i++){
        cameras[i].aspect = 1/camerasCount*width/height;
        cameras[i].updateProjectionMatrix();
        renderer.setViewport(i/camerasCount*width,1,1/camerasCount*width,height);
        renderer.render(scene,cameras[i]);
    }
};



var threeRender = new ThreeRender();
threeRender.render();
/*-----------------------------------------------
// 3次元リサージュの座標データを用意
//             1.0 y
//              ^  -1.0
//              | / z
//              |/       x
// -1.0 -----------------> +1.0
//            / |
//      +1.0 /  |
//           -1.0
*/
