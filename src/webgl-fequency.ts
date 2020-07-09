
const $play:HTMLDivElement = document.querySelector('#play')
let canPlay:boolean = false
let dataArray:Uint8Array
const radius = 100;
const smallRadius = radius * 0.9;
const smallHeight = radius * 0.3;
let frAvg = 0
let canvas = document.querySelector('canvas');
canvas.width = document.body.offsetWidth
canvas.height = document.body.offsetHeight

$play.onclick = ()=>{
  $play.style.display = 'none'
  loadAudio('./src/assets/miku.mp3').then(({analyser,source})=>{
    window.analyser = analyser
    window.source = source

    source.start()
    dataArray = new Uint8Array(analyser.frequencyBinCount)

    canPlay = true
  })
}

let now = new Date();
let pre = now;
      
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
  50,
  canvas.width / canvas.height,
  0.1,
  10000
);

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
  vertexShader: `
  
    
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
`,
  fragmentShader: `
    varying vec3 v_normal;
        
    void main() {
      vec3 color = v_normal+vec3(.5);
      gl_FragColor = vec4(normalize(color) , 1.);
    }

  `,
  uniforms:{
    time: { type: '1f', value: 0 },
    frAvg:{type:'1f',value:0}
  },
  transparent: true,
  blending: THREE.AdditiveBlending
});

function createPoints(radius, position) {
  let initGeom = new THREE.IcosahedronGeometry(radius, 5);
  let geom = new THREE.Geometry();
  let bufferGeom = new THREE.BufferGeometry();
  let vertices = [];

  geom.vertices = initGeom.vertices;

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
    bufferOpacity[i] = 1;
  });
  
  bufferGeom.addAttribute('position', new THREE.BufferAttribute(bufferVertices, 3));
  bufferGeom.addAttribute('normal', new THREE.BufferAttribute(bufferNormals, 3));
  bufferGeom.addAttribute('opacity', new THREE.BufferAttribute(bufferOpacity, 1));

  let points = new THREE.Points(bufferGeom, material);
  return points;
}

scene.add(createPoints(
  radius * 0.9,
  new THREE.Vector3(0, radius * 0.18, 0)
));

  
requestAnimationFrame(function animate(){
  requestAnimationFrame(animate)

  if(canPlay){
    analyser.getByteFrequencyData(dataArray)


    material.uniforms.frAvg.value = Math.pow(avg(dataArray)/(255),.5)

    now = new Date();
    material.uniforms.time.value += (now - pre) * 0.0008;
    pre = now;

  }
  

  camera.lookAt(0,0,0);
  renderer.render(scene, camera);

})
