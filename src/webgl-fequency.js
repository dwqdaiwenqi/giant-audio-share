"use strict";
var $play = document.querySelector('#play');
var canPlay = false;
var dataArray;
var radius = 100;
var smallRadius = radius * 0.9;
var smallHeight = radius * 0.3;
var frAvg = 0;
var canvas = document.querySelector('canvas');
canvas.width = document.body.offsetWidth;
canvas.height = document.body.offsetHeight;
$play.onclick = function () {
    $play.style.display = 'none';
    loadAudio('./src/assets/miku.mp3').then(function (_a) {
        var analyser = _a.analyser, source = _a.source;
        window.analyser = analyser;
        window.source = source;
        source.start();
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        canPlay = true;
    });
};
var now = new Date();
var pre = now;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(50, canvas.width / canvas.height, 0.1, 10000);
camera.position.z = 600;
camera.lookAt(new THREE.Vector3);
var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(canvas.width, canvas.height);
renderer.setClearColor(0x000000, 1);
renderer.setPixelRatio(1);
var material = new THREE.ShaderMaterial({
    vertexShader: "\n  \n    \n  vec3 random_perlin( vec3 p ) {\n    p = vec3(\n            dot(p,vec3(127.1,311.7,69.5)),\n            dot(p,vec3(269.5,183.3,132.7)), \n            dot(p,vec3(247.3,108.5,96.5)) \n            );\n    return -1.0 + 2.0*fract(sin(p)*43758.5453123);\n}\nfloat noise_perlin (vec3 p) {\n    vec3 i = floor(p);\n    vec3 s = fract(p);\n\n    // 3D\u7F51\u683C\u67098\u4E2A\u9876\u70B9\n    float a = dot(random_perlin(i),s);\n    float b = dot(random_perlin(i + vec3(1, 0, 0)),s - vec3(1, 0, 0));\n    float c = dot(random_perlin(i + vec3(0, 1, 0)),s - vec3(0, 1, 0));\n    float d = dot(random_perlin(i + vec3(0, 0, 1)),s - vec3(0, 0, 1));\n    float e = dot(random_perlin(i + vec3(1, 1, 0)),s - vec3(1, 1, 0));\n    float f = dot(random_perlin(i + vec3(1, 0, 1)),s - vec3(1, 0, 1));\n    float g = dot(random_perlin(i + vec3(0, 1, 1)),s - vec3(0, 1, 1));\n    float h = dot(random_perlin(i + vec3(1, 1, 1)),s - vec3(1, 1, 1));\n\n    // Smooth Interpolation\n    vec3 u = smoothstep(0.,1.,s);\n\n    // \u6839\u636E\u516B\u4E2A\u9876\u70B9\u8FDB\u884C\u63D2\u503C\n    return mix(mix(mix( a, b, u.x),\n                mix( c, e, u.x), u.y),\n            mix(mix( d, f, u.x),\n                mix( g, h, u.x), u.y), u.z);\n}\n  \n  uniform float time;\n  uniform float frAvg;\n  varying vec3 v_normal;\n  \n  void main() {\n\n    v_normal = normal;\n    \n    float maxLength = 7.7;\n    float addLength = maxLength * noise_perlin(normalize(position) * frAvg*10.0 + vec3(time * 1.0));\n\n    vec3 newPosition = position + normal * (addLength + frAvg*100.);\n\n    vec4 mPosition = modelViewMatrix * vec4(newPosition, 1.0);\n    gl_PointSize = max(.2, frAvg*3.);\n   \n    gl_Position = projectionMatrix * mPosition;\n  }\n",
    fragmentShader: "\n    varying vec3 v_normal;\n        \n    void main() {\n      vec3 color = v_normal+vec3(.5);\n      gl_FragColor = vec4(normalize(color) , 1.);\n    }\n\n  ",
    uniforms: {
        time: { type: '1f', value: 0 },
        frAvg: { type: '1f', value: 0 }
    },
    transparent: true,
    blending: THREE.AdditiveBlending
});
function createPoints(radius, position) {
    var initGeom = new THREE.IcosahedronGeometry(radius, 5);
    var geom = new THREE.Geometry();
    var bufferGeom = new THREE.BufferGeometry();
    var vertices = [];
    geom.vertices = initGeom.vertices;
    geom.lookAt(position.clone().negate());
    geom.translate(position.x, position.y, position.z);
    vertices = geom.vertices;
    var length = vertices.length;
    var bufferVertices = new Float32Array(length * 3);
    var bufferNormals = new Float32Array(length * 3);
    var bufferOpacity = new Float32Array(length);
    vertices.forEach(function (v, i) {
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
    var points = new THREE.Points(bufferGeom, material);
    return points;
}
scene.add(createPoints(radius * 0.9, new THREE.Vector3(0, radius * 0.18, 0)));
requestAnimationFrame(function animate() {
    requestAnimationFrame(animate);
    if (canPlay) {
        analyser.getByteFrequencyData(dataArray);
        material.uniforms.frAvg.value = Math.pow(avg(dataArray) / (255), .5);
        now = new Date();
        material.uniforms.time.value += (now - pre) * 0.0008;
        pre = now;
    }
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
});
