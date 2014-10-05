var camera, scene, renderer;
    var effect, controls;
    var element, container;
    var cameraOrtho, sceneOrtho;
    var clock = new THREE.Clock();
    var loader = new GSVPANO.PanoLoader();
var test;
var cat;
var attackbtn1;
var attackbtn2;
var attackbtn3;
var gui;
var m1;
var m2;
var m3;
var m1d;
var m2d;
var m3d;
var pointerDistance = 0;
var ground;
var enemy;
var skybox;
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
    this.attackMax = 1000;

    this.didMove = false;

    var mesh;
    var mesh2;
    var mesh3;

    this.onCharge = function(num, delta){
      if(this.active != 0)
        return;
      if(num != this.progressFocus){
        this.progressFocus = num;
        this.progress = 0;

      }
      if(num==0)mesh2.material.color.setHex(0xFF6666);
      if(num==1)mesh2.material.color.setHex(0x66FF66);
      if(num==2)mesh2.material.color.setHex(0x6666FF);
      this.progress += delta*1000;
      if(this.progress >= this.progressMAX){
        this.active = this.activeMax;
        mesh2.material.opacity = 1;
      }
      this.didMove = true;

    }

    this.onAttack = function(num, delta){
      var damage = 0;
      if(this.active <= 0){
        mesh2.material.opacity = 0;
        this.active = 0;
        return;
      }
      if(num != this.attackFocus){
        this.attackFocus = num;
        this.attack = 0;
      }
      this.attack += delta*1000;
      if(this.attack >= this.attackMax){
        //Console.log("Hit ;)");
        damage = num+1;
        this.attack = 0;
        this.active = 0;
        this.progress = 0;
      }
      this.didMove = true;
      return damage;
    }

    this.init = function(scene){

      var texture = THREE.ImageUtils.loadTexture( createColorImage(64,255,255,255) );
      var material = new THREE.SpriteMaterial( { map: texture } );
      var geometry = new THREE.PlaneGeometry(18, 18);

      mesh = new THREE.Sprite( material );
      texture = THREE.ImageUtils.loadTexture( createColorImage(64,255,255,255) );
      material = new THREE.SpriteMaterial( { map: texture } );
      mesh2 = new THREE.Sprite( material );
      //this.mesh. = -Math.PI / 2;
      mesh.scale.set( 1, 1, 1 );
      mesh2.scale.set( 1.5, 1.5, 1 );
      mesh2.material.opacity = 0;
      mesh2.material.color.setHex(0xFFBBBB);
      scene.add(mesh);
      scene.add(mesh2);
    }

    this.update = function(delta){
      delta = delta*1000;

      if(!this.didMove){
        if(this.active != 0)
        {
           this.active -= delta;
           if(this.active <= 0){
              this.active = 0;
              this.progress = 0;
              mesh2.material.opacity = 0;
            }
        }
        else{
           this.progress -= delta;
           if(this.progress < 0)
              this.progress = 0;

           
        }
      }
      var point = new THREE.Vector3( 0, 0, -1 );
      point.applyQuaternion( camera.quaternion );
      point.multiplyScalar(pointerDistance-1);
      point.addVectors(camera.position,point);
     // mesh.position.set(,point.y,point.z);//= new THREE.Vector3( 4, 5, -1 );//;
      mesh.position.x = point.x;
      mesh.position.z = point.z;
      mesh.position.y = point.y;
      mesh.lookAt(camera.position);
      mesh.material.opacity = this.progress*1.0/this.progressMAX;
      var duck = 1*(this.active*1.0/this.activeMax);
      mesh2.scale.set( 1+duck, 1+duck, 1 );
      mesh2.position.x = point.x;
      mesh2.position.z = point.z;
      mesh2.position.y = point.y;
      mesh2.lookAt(camera.position);

      this.didMove = false;
    }

  
}


function ENEMY(){
    
    var mesh;
    var mesh2;
    var a = 0;
    var activespeed = 0.5+parseInt(Math.random()*2);
    var boostspeed = 1;
    var distanceFrom = 20 + 10*parseInt(Math.random()*5);
    var dir = 1;
    if(Math.random()>.5)dir = -1;
    var boostTime = 0;
    var boostTimeMax = (parseInt(Math.random()*6)-3)*1000;
    var boostspeedAdd = parseInt(Math.random()*6)-3;
    var health = 2+parseInt(Math.random()*5);

    var type = 3;//1+parseInt(Math.random()*3);

    var color = 0;
    var colorTime = 0;
    var colorChangeTime = (parseInt(Math.random()*4)+1)*1000; 

    var telaDis = (parseInt(Math.random()*10)-5)*5;
    var teleTime = 0;
    var teleChangeTime = (parseInt(Math.random()*4)+2)*1000; 

    this.getmesh = function(){
      return mesh;
    }

    this.init = function(scene){
      var texture = THREE.ImageUtils.loadTexture( createColorImage(64,255,0,0) );
      var material = new THREE.SpriteMaterial( { map: texture } );
      var geometry = new THREE.PlaneGeometry(15, 15);

     mesh = new THREE.Mesh( new THREE.BoxGeometry( 7, 7, 4 ), m1 );

      //mesh.scale.set( 10, 10, 1 );
      //this.mesh. = -Math.PI / 2;

      scene.add(mesh);

      texture = THREE.ImageUtils.loadTexture( createColorImage(64,255,255,255) );
      material = new THREE.SpriteMaterial( { map: texture } );
      mesh2 = new THREE.Sprite( material );
      mesh2.material.color.setHex(0x66FF66);
      mesh2.scale.set( health, 1, 1 );
       scene.add(mesh2);

    }

    this.update = function(delta){
      delta = delta*1000;
      var scale = distanceFrom;
      a += dir*delta/10000*activespeed*boostspeed;
      var x = scale*Math.sin(a*90* Math.PI / 180);
      var z = scale*Math.cos(a*90* Math.PI / 180);

      if(type ==2 && colorTime < 2){
        color = parseInt(Math.random()*3)+1;
        colorTime = colorChangeTime;
      }
      colorTime -= delta;
      if(type ==3 && teleTime < 0){
        a = a+telaDis*10000000;
        teleTime = teleChangeTime;
      }
      teleTime -= delta;
      if(color==0)mesh.material.color.setHex(0xFFFFFF);
      if(color==1)mesh.material.color.setHex(0xFF6666);
      if(color==2)mesh.material.color.setHex(0x66FF66);
      if(color==3)mesh.material.color.setHex(0x6666FF);
      mesh.position.x = x;
      mesh.position.z = z;
      mesh.position.y = 10;
      
      mesh2.position.x = x;
      mesh2.position.z = z;
      mesh2.position.y = 20;
      mesh2.scale.set( health, 1, 1 );
      mesh.lookAt(new THREE.Vector3(0, 4, 0));
      boostTime -= delta;
      if(boostTime < 0)
      boostspeed = 1;
    }

    this.takeDamage = function(damage){
      boostTime = boostTimeMax;
      boostspeed = boostspeedAdd;
      if(color==0&&damage>0)
        health--;
      else if(damage>0){
        if(color==1){
          if(damage==1)health-=1;
          if(damage==2)health-=2;
        }
        if(color==2){
          if(damage==2)health-=1;
          if(damage==3)health-=2;
        }
        if(color==3){
          if(damage==3)health-=1;
          if(damage==1)health-=2;
        }
      }
      if(health<=0){
        scene.remove(mesh);
        scene.remove(mesh2);
        
      }
    }

}


    function init() {
      var width = window.innerWidth;
      var height = window.innerHeight;

      renderer = new THREE.WebGLRenderer();
      element = renderer.domElement;
      container = document.getElementById('example');
      loader.onPanoramaLoad = function () {
            var img_uri= this.canvas.toDataURL("image/png");
            var image = new Image();
            image.src =img_uri;
            
            var sphere = new THREE.Mesh(
            new THREE.SphereGeometry(100, 32, 32),
            new THREE.MeshBasicMaterial({
              map: THREE.ImageUtils.loadTexture(img_uri)
              })
            );
            sphere.scale.x = -1;
            scene.add(sphere);

        };

        // Invoke the load method with a LatLng point.
      loader.load( new google.maps.LatLng( 51.50700703827454, -0.12791916931155356 ) );
      container.appendChild(element);
      gui = new GUI();

      effect = new THREE.StereoEffect(renderer);

      scene = new THREE.Scene();
      
      scene.fog = new THREE.Fog( 0x87CEFB, 300, 600 );
      renderer.setClearColor( 0x87CEFB );
      camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
      camera.position.set(0, 20, 0);

      skybox = new THREE.Mesh( new THREE.SphereGeometry( 500, 60, 40 ), new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( createColorImage(64,127,127,127) ) } ) );
      skybox.doubleSided = true;
      scene.add( skybox );

      enemy = new ENEMY();
      enemy.init(scene);

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

      ground = new THREE.Mesh(geometry, material);
      ground.rotation.x = -Math.PI / 2;
      scene.add(ground);
      

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
      m1  = new THREE.MeshBasicMaterial( { map: t1 } );
      m2  = new THREE.MeshBasicMaterial( { map: t2 } );
      m3  = new THREE.MeshBasicMaterial( { map: t3 } );
      t1 = THREE.ImageUtils.loadTexture(
        createColorImage(64,180,40,40)
      );
      t2 = THREE.ImageUtils.loadTexture(
        createColorImage(64,40,180,40)
      );
       t3 = THREE.ImageUtils.loadTexture(
        createColorImage(64,40,40,180)
      );
      m1d  = new THREE.MeshBasicMaterial( { map: t1 } );
      m2d  = new THREE.MeshBasicMaterial( { map: t2 } );
      m3d  = new THREE.MeshBasicMaterial( { map: t3 } );

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
      var hit = false;
      if(intersects.length > 0){
        pointerDistance = intersects[0].distance;
        hit = true;
    
        gui.onCharge(0,dt);
        for(var i=0;i<attackbtn1.children.length;i++)
          attackbtn1.children[i].material.color.setHex(0xBBBBBB);
      }
      else
        for(var i=0;i<attackbtn1.children.length;i++)
          attackbtn1.children[i].material.color.setHex(0xffFFFF);
        
      intersects = raycaster.intersectObject( attackbtn2, true );
      if(intersects.length > 0){
        pointerDistance = intersects[0].distance;
        
        hit = true;
        gui.onCharge(2,dt);
        for(var i=0;i<attackbtn2.children.length;i++)
          attackbtn2.children[i].material.color.setHex(0xBBBBBB);
      }
      else
        for(var i=0;i<attackbtn2.children.length;i++)
          attackbtn2.children[i].material.color.setHex(0xffFFFF);

      intersects = raycaster.intersectObject( attackbtn3, true );
      if(intersects.length > 0){
        pointerDistance = intersects[0].distance;
        hit = true;
        gui.onCharge(1,dt);
        for(var i=0;i<attackbtn3.children.length;i++)
          attackbtn3.children[i].material.color.setHex(0xBBBBBB);
      }
      else
        for(var i=0;i<attackbtn3.children.length;i++)
          attackbtn3.children[i].material.color.setHex(0xffFFFF);
      intersects = raycaster.intersectObject( enemy.getmesh(), true );
      if(!hit && intersects.length > 0){
        pointerDistance = intersects[0].distance;
        hit = true;
        var damage = gui.onAttack(0,dt);
        enemy.takeDamage(damage);
        if(damage > 0)
        enemy.getmesh().material.color.setHex(0xBBBBBB);
      }
      else{
        enemy.getmesh().material.color.setHex(0xFFFFFF);
      }  
      intersects = raycaster.intersectObject( ground, true );
      if(!hit && intersects.length > 0){
        pointerDistance = intersects[0].distance;
      }  

      
      cat.lookAt(camera.position);
      enemy.update(dt);
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