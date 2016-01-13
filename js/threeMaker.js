// カメラ設定 ------------------------------------------
var CameraMaker = function (positionX, positionY, positionZ) {
    var self = this;

    this.fov = 60;
    this.aspect = $(window).width()/$(window).height();
    this.near = 0.01;
    this.far = 20000;

    this.look = {
        x:0,
        y:0,
        z:0
    };
    var position = {};
    position.x = positionX !== undefined ? positionX : 300;
    position.y = positionY !== undefined ? positionY : 300;
    position.z = positionZ !== undefined ? positionZ : 300;

    this.init = function(renderer){
        self.camera = new THREE.PerspectiveCamera(self.fov, self.aspect, self.near, self.far);
        self.camera.position.set(position.x,position.y,position.z);

        var controllsJudge = renderer !== undefined ? true : false;//引数なかったらcontrollsなし
        if(controllsJudge){
            var controls = new THREE.OrbitControls(self.camera,renderer.domElement);
        }
        else{
            self.camera.lookAt(new THREE.Vector3(self.look.x, self.look.y, self.look.z));
        }

        //return self.camera;
    };

};



var LineMaker = function (position1,position2,color) {
    this.color = color !== undefined ? color : 0x00c8ff;
    this.geometry = new THREE.Geometry();
    this.material = new THREE.LineBasicMaterial({
        color: this.color
    });
    this.geometry.vertices.push(new THREE.Vector3(position1.x, position1.y, position1.z));
    this.geometry.vertices.push(new THREE.Vector3(position2.x, position2.y, position2.z));
    this.line = new THREE.Line(this.geometry, this.material);


};



var CircleMaker = function(color,wireframe,radius,segments){
    var self = this;

    this.color = color || 0x00c8ff;
    this.radius = radius || 5;
    this.segments = segments || 20;
    this.wireframe = wireframe !== undefined ? wireframe : false;

    this.material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,//普通はおもて面だけの描画なので、うらからみると見えない　=> この設定で、両面描画させる
        color: this.color,
        wireframe:this.wireframe,
        opacity:0.5,
        transparent:true//opacityのみ設定しても透過しない(transparentをtrueにする必要あり)
    });
    this.geometry = new THREE.CircleGeometry( this.radius, this.segments );
    this.mesh = new THREE.Mesh( this.geometry, this.material );

};
CircleMaker.prototype.circularMotion = function(radius,theta,center){//center = {x:,y:,z:} or object.position
    var self = this;
    if(radius !== undefined && theta !== undefined && center !== undefined){
        this.mesh.position.x = radius*Math.sin(theta);
        this.mesh.position.z = radius*Math.cos(theta);
        this.mesh.lookAt(center);
    }else{
        console.error("some argument of circularMotion() are undefined.");
    }
};



var BoxMaker = function(color,wireframe,width,height,depth,segments){
    this.color = color || 0xffffff;
    this.wireframe = wireframe !== undefined ? wireframe : true;
    this.width = width || 1;
    this.height = height || 1;
    this.depth = depth || 1;
    this.segments = {};
    this.segments.x = segments || 1;
    this.segments.y = segments || 1;
    this.segments.z = segments || 1;

    this.geometry = new THREE.BoxGeometry( this.width, this.height, this.depth ,this.segments.y,this.segments.x,this.segments.z);
    this.material = new THREE.MeshBasicMaterial( {
        color: this.color,
        wireframe:this.wireframe
    } );
    this.mesh = new THREE.Mesh( this.geometry, this.material );
};
BoxMaker.prototype.circularMotion = CircleMaker.prototype.circularMotion;



var SphereMaker = function(setting){//setting = {color,radius}
    var self = this;
    this.color = setting.color || 0x00c8ff;
    this.radius = setting.radius || 50;
    this.material = new THREE.MeshLambertMaterial( { color: this.color, wireframe:true } );
    /*this.material = new THREE.MeshBasicMaterial({
        color: this.color,
        wireframe: true,
        wireframeLinewidth: 1
    });*/
    //this.material = new THREE.MeshPhongMaterial( { color: 0x008866, wireframe:true } );
    this.geometry = new THREE.SphereGeometry( this.radius, 25, 25, 0, Math.PI * 2, 0, Math.PI );
    this.mesh = new THREE.Mesh( this.geometry, this.material );

    //return this.mesh;
};


// オブジェクト追加 ----------------------------------------
/*var Obj = function(){
    var self = this;
    this.IcosGM = {};
    this.ringGM = {};

    this.IcosSet = function(){
        if(self.IcosGM.geometry !== void(0) && self.IcosGM.material !== void(0)){
            self.Icos = new THREE.Mesh(self.IcosGM.geometry, self.IcosGM.material);
        }else{
            console.error("IcosGM.geometry or IcosGM.material is undefined");
        }
    }

    this.ringSet = function(sgeometry, bgeometry, material){
        if(self.ringGM.Sgeometry !== void(0) && self.ringGM.material !== void(0) && self.ringGM.Bgeometry !== void(0)){
            self.smallerRing = new THREE.Mesh(self.ringGM.Sgeometry, self.ringGM.material);
            self.biggerRing = new THREE.Mesh(self.ringGM.Bgeometry, self.ringGM.material);
        }else{
            console.error("ringGM.Sgeometry or ringGM.Bgeometry or ringGM.material is undefined");
        }
    }

}*/
