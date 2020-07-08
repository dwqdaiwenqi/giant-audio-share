 var context = new(window.AudioContext || window.webkitAudioContext)();
 var analyser = context.createAnalyser();
 analyser.fftSize = 512;

  var $audio = document.querySelector('#audio')

  var source = context.createMediaElementSource($audio);
  
  source.connect(analyser);
  analyser.connect(context.destination);
  
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength); 

  let frAvg = 0

  requestAnimationFrame(function animate(){
    requestAnimationFrame(animate)
    analyser.getByteFrequencyData(dataArray)

    material.uniforms.frAvg.value = Math.pow(avg(dataArray)/(255),.5)
        //console.log(dataArray)

  })


  
function avg(arr){
 var total = arr.reduce(function(sum, b) { return sum + b; });
 return (total / arr.length);
}
    



  var pow = Math.pow,
  sqrt = Math.sqrt,
  sin = Math.sin,
  cos = Math.cos,
  PI = Math.PI,
  c1 = 1.70158,
  c2 = c1 * 1.525,
  c3 = c1 + 1,
  c4 = ( 2 * PI ) / 3,
  c5 = ( 2 * PI ) / 4.5;
  
  
      const VERTEX_SHADER = `
  
    
      vec3 random_perlin( vec3 p ) {
        p = vec3(
                dot(p,vec3(127.1,311.7,69.5)),
                dot(p,vec3(269.5,183.3,132.7)), 
                dot(p,vec3(247.3,108.5,96.5)) 
                );
        return -1.0 + 2.0*fract(sin(p)*43758.5453123);
    }
    float noise_perlin (vec3 p) {
        vec3 i = floor(p);
        vec3 s = fract(p);
  
        // 3D网格有8个顶点
        float a = dot(random_perlin(i),s);
        float b = dot(random_perlin(i + vec3(1, 0, 0)),s - vec3(1, 0, 0));
        float c = dot(random_perlin(i + vec3(0, 1, 0)),s - vec3(0, 1, 0));
        float d = dot(random_perlin(i + vec3(0, 0, 1)),s - vec3(0, 0, 1));
        float e = dot(random_perlin(i + vec3(1, 1, 0)),s - vec3(1, 1, 0));
        float f = dot(random_perlin(i + vec3(1, 0, 1)),s - vec3(1, 0, 1));
        float g = dot(random_perlin(i + vec3(0, 1, 1)),s - vec3(0, 1, 1));
        float h = dot(random_perlin(i + vec3(1, 1, 1)),s - vec3(1, 1, 1));
  
        // Smooth Interpolation
        vec3 u = smoothstep(0.,1.,s);
  
        // 根据八个顶点进行插值
        return mix(mix(mix( a, b, u.x),
                    mix( c, e, u.x), u.y),
                mix(mix( d, f, u.x),
                    mix( g, h, u.x), u.y), u.z);
    }

      
      uniform float time;
      uniform float frAvg;
      varying vec3 v_normal;
      
      void main() {
  
        v_normal = normal;
        

        float maxLength = 7.7;
        float addLength = maxLength * noise_perlin(normalize(position) * frAvg*10.0 + vec3(time * 1.0));
  
        vec3 newPosition = position + normal * (addLength + frAvg*100.);
  
        vec4 mPosition = modelViewMatrix * vec4(newPosition, 1.0);
        gl_PointSize = max(.2, frAvg*3.);
        gl_Position = projectionMatrix * mPosition;
      }
  `;
      const FRAGMENT_SHADER = `
      varying vec3 v_normal;
      
      void main() {
        vec3 color = v_normal+vec3(.5);
        gl_FragColor = vec4(normalize(color) , 1.);
      }
  `;
      const radius = 100;
      const smallRadius = radius * 0.9;
      const smallHeight = radius * 0.3;
  
      let canvas = document.querySelector('#c');
      let scene = new THREE.Scene();
      let camera = new THREE.PerspectiveCamera(
        50,
        canvas.width / canvas.height,
        0.1,
        10000
      );
      // camera.position.y = -4;
      camera.position.z = 600;
      camera.lookAt(new THREE.Vector3)
      var renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
      });
  
      renderer.setSize(canvas.width, canvas.height);
      renderer.setClearColor(0x000000, 1);
      renderer.setPixelRatio(1);
      let material = new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        uniforms:{
          time: { type: '1f', value: 0 },
          frAvg:{type:'1f',value:0}
        },
        transparent: true,
        blending: THREE.AdditiveBlending
      });
  
      function createPoints(radius, position, opacityStart = 0.5, opacityEnd = -0.2, opacityMax = 1) {
        let initGeom = new THREE.IcosahedronGeometry(radius, 5);
        let geom = new THREE.Geometry();
        let bufferGeom = new THREE.BufferGeometry();
        let vertices = [];
      
  
        initGeom.lookAt(new THREE.Vector3(Math.random(), Math.random(), Math.random()));
        geom.vertices = initGeom.vertices;
        geom.vertices = geom.vertices.filter(v => {
          v.opacity = 1
          return true
        });
        geom.lookAt(position.clone().negate());
        geom.translate(position.x, position.y, position.z);
        vertices = geom.vertices;
  
        let length = vertices.length;
        let bufferVertices = new Float32Array(length * 3);
        let bufferNormals = new Float32Array(length * 3);
        let bufferOpacity = new Float32Array(length);
  
        vertices.forEach((v, i) => {
          bufferVertices[i * 3] = v.x;
          bufferVertices[i * 3 + 1] = v.y;
          bufferVertices[i * 3 + 2] = v.z;
          v.normalize();
          bufferNormals[i * 3] = v.x;
          bufferNormals[i * 3 + 1] = v.y;
          bufferNormals[i * 3 + 2] = v.z;
          bufferOpacity[i] = v.opacity;
        });
        // console.log(vertices)
        bufferGeom.addAttribute('position', new THREE.BufferAttribute(bufferVertices, 3));
        bufferGeom.addAttribute('normal', new THREE.BufferAttribute(bufferNormals, 3));
        bufferGeom.addAttribute('opacity', new THREE.BufferAttribute(bufferOpacity, 1));
  
        let points = new THREE.Points(bufferGeom, material);
        return points;
      }
  
      scene.add(createPoints(
        radius * 0.9,
        new THREE.Vector3(0, radius * 0.18, 0),
        0.9, 0.0, 0.9
      ));
  
  
      let now = new Date();
      let pre = now;
      let cameraOffsetStep = 6;
      (function tick() {
        now = new Date();
        material.uniforms.time.value += (now - pre) * 0.0008;
        pre = now;
        if (camera.position.x > 200) {
          cameraOffsetStep = -2
        } else if (camera.position.x < -200) {
          cameraOffsetStep = 2
        }
        // camera.position.x += cameraOffsetStep;
        
        camera.lookAt(0,0,0);
        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
      })();
    
