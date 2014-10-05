var camera, scene, renderer;
    var effect, controls;
    var element, container;

    var clock = new THREE.Clock();
var test;
var cat;
    init();
    animate();

    function init() {
      renderer = new THREE.WebGLRenderer();
      element = renderer.domElement;
      container = document.getElementById('example');
      container.appendChild(element);

      effect = new THREE.StereoEffect(renderer);

      scene = new THREE.Scene();
      sceneCube = new THREE.Scene();
      scene.fog = new THREE.Fog( 0x87CEFB, 300, 600 );
      renderer.setClearColor( 0x87CEFB );
      camera = new THREE.PerspectiveCamera(45, 1, 0.001, 700);
      camera.position.set(0, 10, 0);
      scene.add(camera);

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

      var material = new THREE.ShaderMaterial( {

          fragmentShader: shader.fragmentShader,
          vertexShader: shader.vertexShader,
          uniforms: shader.uniforms,
          depthWrite: false,
          side: THREE.BackSide

      } ),

      mesh = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), material );
      sceneCube.add( mesh );

//      viewLine.

      material  = new THREE.MeshBasicMaterial( { map: texture } );

      /*new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0xffffff,
        shininess: 20,
        shading: THREE.FlatShading,
        map: texture
      });*/

      var geometry = new THREE.PlaneGeometry(1000, 1000);

      var mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2;
      scene.add(mesh);
       material  = new THREE.MeshBasicMaterial( { map: textureBrown } );

      geometry = new THREE.BoxGeometry( 5, 5, 5 );

      test = new THREE.Mesh(geometry, material);
      test.position.x = - 10;
      test.position.y =  5;
      scene.add(test);

      window.addEventListener('resize', resize, false);
      setTimeout(resize, 1);
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
      var intersects = raycaster.intersectObject( test, true );
      if(intersects.length > 0)
      {
        console.log("HIT");

      }
      
      cat.lookAt(camera.position);
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