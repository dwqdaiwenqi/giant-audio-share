"use strict";
var context = new (window.AudioContext || window.webkitAudioContext)();
var analyser = context.createAnalyser();
analyser.fftSize = 512;
var $audio = document.querySelector('#audio');
var source = context.createMediaElementSource($audio);
source.connect(analyser);
analyser.connect(context.destination);
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
var frAvg = 0;
requestAnimationFrame(function animate() {
    requestAnimationFrame(animate);
    analyser.getByteFrequencyData(dataArray);
    material.uniforms.frAvg.value = Math.pow(avg(dataArray) / (255), .5);
    //console.log(dataArray)
});
function avg(arr) {
    var total = arr.reduce(function (sum, b) { return sum + b; });
    return (total / arr.length);
}
var pow = Math.pow, sqrt = Math.sqrt, sin = Math.sin, cos = Math.cos, PI = Math.PI, c1 = 1.70158, c2 = c1 * 1.525, c3 = c1 + 1, c4 = (2 * PI) / 3, c5 = (2 * PI) / 4.5;
var VERTEX_SHADER = "\n  \n    \n      vec3 random_perlin( vec3 p ) {\n        p = vec3(\n                dot(p,vec3(127.1,311.7,69.5)),\n                dot(p,vec3(269.5,183.3,132.7)), \n                dot(p,vec3(247.3,108.5,96.5)) \n                );\n        return -1.0 + 2.0*fract(sin(p)*43758.5453123);\n    }\n    float noise_perlin (vec3 p) {\n        vec3 i = floor(p);\n        vec3 s = fract(p);\n  \n        // 3D\u7F51\u683C\u67098\u4E2A\u9876\u70B9\n        float a = dot(random_perlin(i),s);\n        float b = dot(random_perlin(i + vec3(1, 0, 0)),s - vec3(1, 0, 0));\n        float c = dot(random_perlin(i + vec3(0, 1, 0)),s - vec3(0, 1, 0));\n        float d = dot(random_perlin(i + vec3(0, 0, 1)),s - vec3(0, 0, 1));\n        float e = dot(random_perlin(i + vec3(1, 1, 0)),s - vec3(1, 1, 0));\n        float f = dot(random_perlin(i + vec3(1, 0, 1)),s - vec3(1, 0, 1));\n        float g = dot(random_perlin(i + vec3(0, 1, 1)),s - vec3(0, 1, 1));\n        float h = dot(random_perlin(i + vec3(1, 1, 1)),s - vec3(1, 1, 1));\n  \n        // Smooth Interpolation\n        vec3 u = smoothstep(0.,1.,s);\n  \n        // \u6839\u636E\u516B\u4E2A\u9876\u70B9\u8FDB\u884C\u63D2\u503C\n        return mix(mix(mix( a, b, u.x),\n                    mix( c, e, u.x), u.y),\n                mix(mix( d, f, u.x),\n                    mix( g, h, u.x), u.y), u.z);\n    }\n  \n  \n     \n      attribute float opacity;\n      \n      uniform float time;\n      uniform float frAvg;\n      varying vec3 v_normal;\n      // varying float v_addLength;\n      varying float v_color;\n      varying float v_opacity;\n      \n      void main() {\n  \n        v_normal = normal;\n        v_opacity = opacity;\n        \n\n        float maxLength = 7.7;\n        float addLength = maxLength * noise_perlin(normalize(position) * frAvg*10.0 + vec3(time * 1.0));\n  \n        v_color = .7;\n        vec3 newPosition = position + normal * (addLength + frAvg*100.);\n  \n        vec4 mPosition = modelViewMatrix * vec4(newPosition, 1.0);\n        gl_PointSize = max(.2, frAvg*3.);\n        gl_Position = projectionMatrix * mPosition;\n      }\n  ";
var FRAGMENT_SHADER = "\n      varying float v_opacity;\n      varying vec3 v_normal;\n      varying float v_color;\n      \n      void main() {\n        // vec3 color = normalize(v_color * 0.5 + 0.5 * v_normal + 0.1) * (v_color + 0.1) * 2.0;\n        vec3 color = (v_color * 0.05) + v_normal + 0.5;\n        color.x += v_color * 0.2;\n        color.z += v_color * 0.2;\n        gl_FragColor = vec4(normalize(color) , v_opacity);\n          // gl_FragColor = vec4(v_opacity,v_opacity,v_opacity,v_opacity);\n      }\n  ";
var radius = 100;
var smallRadius = radius * 0.9;
var smallHeight = radius * 0.3;
var canvas = document.querySelector('#c');
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(50, canvas.width / canvas.height, 0.1, 10000);
// camera.position.y = -4;
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
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    uniforms: {
        time: { type: '1f', value: 0 },
        frAvg: { type: '1f', value: 0 }
    },
    transparent: true,
    blending: THREE.AdditiveBlending
});
function createPoints(radius, position, opacityStart, opacityEnd, opacityMax) {
    if (opacityStart === void 0) { opacityStart = 0.5; }
    if (opacityEnd === void 0) { opacityEnd = -0.2; }
    if (opacityMax === void 0) { opacityMax = 1; }
    var initGeom = new THREE.IcosahedronGeometry(radius, 5);
    var geom = new THREE.Geometry();
    var bufferGeom = new THREE.BufferGeometry();
    var vertices = [];
    initGeom.lookAt(new THREE.Vector3(Math.random(), Math.random(), Math.random()));
    geom.vertices = initGeom.vertices;
    geom.vertices = geom.vertices.filter(function (v) {
        v.opacity = 1;
        return true;
    });
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
        bufferOpacity[i] = v.opacity;
    });
    // console.log(vertices)
    bufferGeom.addAttribute('position', new THREE.BufferAttribute(bufferVertices, 3));
    bufferGeom.addAttribute('normal', new THREE.BufferAttribute(bufferNormals, 3));
    bufferGeom.addAttribute('opacity', new THREE.BufferAttribute(bufferOpacity, 1));
    var points = new THREE.Points(bufferGeom, material);
    return points;
}
scene.add(createPoints(radius * 0.9, new THREE.Vector3(0, radius * 0.18, 0), 0.9, 0.0, 0.9));
var now = new Date();
var pre = now;
var cameraOffsetStep = 6;
(function tick() {
    now = new Date();
    material.uniforms.time.value += (now - pre) * 0.0008;
    pre = now;
    if (camera.position.x > 200) {
        cameraOffsetStep = -2;
    }
    else if (camera.position.x < -200) {
        cameraOffsetStep = 2;
    }
    // camera.position.x += cameraOffsetStep;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
})();
