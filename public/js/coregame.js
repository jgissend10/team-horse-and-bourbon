var camera, scene, renderer;
    var effect, controls;
    var element, container;
    var cameraOrtho, sceneOrtho;

    var clock = new THREE.Clock();
var test;
var cat;
var attackbtn1;
var attackbtn2;
var attackbtn3;
var gui;
    init();
    animate();

function GUI(){
    
    this.progressFocus = 0;
    this.progress = 0;
    this.progressMAX = 1500;

    this.active = 0;
    this.activeMax = 5000;

    this.attackFocus = 0;
    this.attack = 0;
    this.attackMax = 2000;

    var mesh;

    this.onCharge = function(num, delta){
      if(this.active != 0)
        return;
      if(num != this.progressFocus){
        this.progressFocus = num;
        this.progress = 0;
      }
      this.progress += delta;
      if(this.progress >= this.progressMAX)
        this.active = this.activeMax;

    }

    this.onAttack = function(num, delta){
      if(this.active <= 0){
        this.active = 0;
        return;
      }
      if(num != this.attackFocus){
        this.attackFocus = num;
        this.attack = 0;
      }
      this.attack += delta;
      if(this.attack >= this.attackMax)
        Console.log("Hit ;)");
    }

    this.init = function(scene){

      var texture = THREE.ImageUtils.loadTexture( createColorImage(64,0,0,0) );
      var material = new THREE.SpriteMaterial( { map: texture } );
      var geometry = new THREE.PlaneGeometry(5, 5);

      mesh = new THREE.Sprite( material );
      
      //this.mesh. = -Math.PI / 2;

      scene.add(mesh);

    }

    this.update = function(delta){
      if(this.active != 0)
      {
         this.active -= delta;
         if(this.active <= 0){
            this.active = 0;
          }
      }
      else{
         this.progress -= delta;
      }
      var point = new THREE.Vector3( 0, 0, -1 );
      point.applyQuaternion( camera.quaternion );
      point.multiplyScalar(20);
      point.addVectors(camera.position,point);
     // mesh.position.set(,point.y,point.z);//= new THREE.Vector3( 4, 5, -1 );//;
      mesh.position.x = point.x;
      mesh.position.z = point.z;
      mesh.position.y = point.y;
      mesh.lookAt(camera.position);
    }

  
}


    function init() {
      var width = window.innerWidth;
      var height = window.innerHeight;

      renderer = new THREE.WebGLRenderer();
      element = renderer.domElement;
      container = document.getElementById('example');
      container.appendChild(element);
      gui = new GUI();

      effect = new THREE.StereoEffect(renderer);

      scene = new THREE.Scene();
      
      scene.fog = new THREE.Fog( 0x87CEFB, 300, 600 );
      renderer.setClearColor( 0x87CEFB );
      camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
      camera.position.set(0, 20, 0);


      

      scene.add(camera);
      gui.init(scene);
      controls = new THREE.OrbitControls(camera, element);
      controls.rotateUp(Math.PI / 4);
      controls.target.set(
        camera.position.x + 0.1,
        camera.position.y,
        camera.position.z
      );
      controls.noZoom = true;
      controls.noPan = true;

      function setOrientationControls(e) {
        if (!e.alpha) {
          return;
        }

        controls = new THREE.DeviceOrientationControls(camera, true);
        controls.connect();
        controls.update();

        element.addEventListener('click', fullscreen, false);

        window.removeEventListener('deviceorientation', setOrientationControls);
      }
      window.addEventListener('deviceorientation', setOrientationControls, true);


      var light =  new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
        light.color.setHSL( 1, 1, 1 );
        light.groundColor.setHSL( 1, 1, 1);
        light.position.set( 0, 500, 0 );
        scene.add( light );

      var mapB = THREE.ImageUtils.loadTexture( "img/test.jpg" );
      var materialB = new THREE.SpriteMaterial( { map: mapB} );

      material = materialB.clone();
       cat = new THREE.Sprite( material );

      cat.position.set( 80, 5, 0 );
      cat.scale.set( 10, 10, 1 );
      //sprite.position.multiplyScalar( radius );

      scene.add( cat );


      var texture = THREE.ImageUtils.loadTexture(
        createColorImage(64,127,230,127)
      );
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat = new THREE.Vector2(64, 64);
      texture.minFilter = THREE.NearestFilter;
      texture.magFilter = THREE.NearestFilter;

      var textureBrown = THREE.ImageUtils.loadTexture(
        createColorImage(64,150, 75, 0)
      );
      textureBrown.wrapS = THREE.RepeatWrapping;
      textureBrown.wrapT = THREE.RepeatWrapping;
      textureBrown.repeat = new THREE.Vector2(64, 64);
      textureBrown.minFilter = THREE.NearestFilter;
      textureBrown.magFilter = THREE.NearestFilter;

      var shader = THREE.ShaderLib[ "cube" ];
        shader.uniforms[ "tCube" ].value = reflectionCube;

      var urls = [
            createColorImage(64,255,255,0), createColorImage(64,255,255,255),
            createColorImage(64,255,0,255), createColorImage(64,255,255,255),
            createColorImage(64,0,255,255), createColorImage(64,0,255,0)
          ];

      var reflectionCube = THREE.ImageUtils.loadTextureCube( urls );
      reflectionCube.format = THREE.RGBFormat;  

      var shader = THREE.ShaderLib[ "cube" ];
        shader.uniforms[ "tCube" ].value = reflectionCube;

    

      material  = new THREE.MeshBasicMaterial( { map: texture } );

    

      var geometry = new THREE.PlaneGeometry(1000, 1000);

      var mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2;
      scene.add(mesh);
      

      loadAttackButtons(scene, camera);

      window.addEventListener('resize', resize, false);
      setTimeout(resize, 1);
    }

    function loadAttackButtons(scene, camera){
       attackbtn1 = new THREE.Object3D();
       attackbtn2 = new THREE.Object3D();
       attackbtn3 = new THREE.Object3D();
      var t1 = THREE.ImageUtils.loadTexture(
        createColorImage(64,230,40,40)
      );
      var t2 = THREE.ImageUtils.loadTexture(
        createColorImage(64,40,230,40)
      );
      var t3 = THREE.ImageUtils.loadTexture(
        createColorImage(64,40,40,230)
      );
      var m1  = new THREE.MeshBasicMaterial( { map: t1 } );
      var m2  = new THREE.MeshBasicMaterial( { map: t2 } );
      var m3  = new THREE.MeshBasicMaterial( { map: t3 } );

      for(var a = 0;a<4;a++){
        var scale = 15;
        var offset = 30;
        var width = 6.6;
        var height = 4;
        var x = scale*Math.sin(a*90* Math.PI / 180);
        var z = scale*Math.cos(a*90* Math.PI / 180);
        var mesh = new THREE.Mesh( new THREE.BoxGeometry( width, height, 0 ), m1 );

        mesh.position.set( x , 5, z );
        mesh.lookAt(camera.position);
        attackbtn1.add( mesh );

        x = scale*Math.sin((a*90+offset)* Math.PI / 180);
        z = scale*Math.cos((a*90+offset)* Math.PI / 180);
        mesh = new THREE.Mesh( new THREE.BoxGeometry( width, height, 0 ), m2 );

        mesh.position.set( x , 5, z );
        mesh.lookAt(camera.position);
        attackbtn2.add( mesh );

        x = scale*Math.sin((a*90+offset+offset)* Math.PI / 180);
        z = scale*Math.cos((a*90+offset+offset)* Math.PI / 180);
        mesh = new THREE.Mesh( new THREE.BoxGeometry( width, height, 0 ), m3 );

        mesh.position.set( x , 5, z );
        mesh.lookAt(camera.position);
        attackbtn3.add( mesh );
      }
      scene.add(attackbtn1);
      scene.add(attackbtn2);
      scene.add(attackbtn3);

    }

    function resize() {
      var width = container.offsetWidth;
      var height = container.offsetHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

     

      renderer.setSize(width, height);
      effect.setSize(width, height);
    }

    function update(dt) {
      resize();

      camera.updateProjectionMatrix();
      
      controls.update(dt);
      var point = new THREE.Vector3( 0, 0, -1 );
      point.applyQuaternion( camera.quaternion );
      //point.applyMatrix4( camera.matrixWorld );
      var raycaster = new THREE.Raycaster( camera.position, point );
      var intersects = raycaster.intersectObject( attackbtn1, true );
      if(intersects.length > 0)
        console.log("RED");
      intersects = raycaster.intersectObject( attackbtn2, true );
      if(intersects.length > 0)
        console.log("GREEN");
      intersects = raycaster.intersectObject( attackbtn3, true );
      if(intersects.length > 0)
        console.log("BLUE");

      
      cat.lookAt(camera.position);
      gui.update(dt);
    }

    function render(dt) {
      //effect.render( sceneCube, camera );
      effect.render(scene, camera);
      
    }

    function animate(t) {
      requestAnimationFrame(animate);

      update(clock.getDelta());
      render(clock.getDelta());
    }

    function fullscreen() {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }
    }