"use strict";
var chroma = window.chroma;
var THREE = window.THREE;
// global variables
var renderer;
var scene;
var camera;
var control;
var stats;
var scale = chroma.scale(['white', 'blue', 'red']).domain([0, 20]);
var pm = new THREE.ParticleBasicMaterial();
pm.map = THREE.ImageUtils.loadTexture("./src/assets/miku.jpg");
pm.transparent = true;
pm.opacity = 0.4;
pm.size = 0.9;
pm.vertexColors = true;
var particleWidth = 100;
var spacing = 0.26;
var centerParticle;
var fallOffParticlesLow1;
var systems = [];
/**
 * Initializes the scene, camera and objects. Called when the window is
 * loaded by using window.onload (see below)
 */
function init() {
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    scene = new THREE.Scene();
    // create a camera, which defines where we're looking at.
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // create a render, sets the background color and the size
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xffffff, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    // position and point the camera to the center of the scene
    camera.position.x = 24;
    camera.position.y = 18;
    camera.position.z = 16;
    camera.lookAt(scene.position);
    setupParticleSystem(particleWidth, particleWidth);
    // setup the control object for the control gui
    control = new function () {
        this.rotationSpeed = 0.001;
        this.opacity = 0.6;
        //            this.color = cubeMaterial.color.getHex();
    };
    // add the output of the renderer to the html element
    document.body.appendChild(renderer.domElement);
    console.log('Log statement from the init function');
    //        console.log(cube);
    // call the render function, after the first render, interval is determined
    // by requestAnimationFrame
    render();
    setupSound();
    loadSound("./src/assets/miku.mp3");
}
function addStatsObject() {
    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);
}
/**
 * Called when the scene needs to be rendered. Delegates to requestAnimationFrame
 * for future renders
 */
function render() {
    // update the camera
    var rotSpeed = control.rotationSpeed;
    camera.position.x = camera.position.x * Math.cos(rotSpeed) + camera.position.z * Math.sin(rotSpeed);
    camera.position.z = camera.position.z * Math.cos(rotSpeed) - camera.position.x * Math.sin(rotSpeed);
    camera.lookAt(scene.position);
    // change opacity
    //    scene.getObjectByName('cube').material.opacity = control.opacity;
    // change color
    //    scene.getObjectByName('cube').material.color = new THREE.Color(control.color);
    // update stats
    // stats.update();
    // and render the scene
    renderer.render(scene, camera);
    // render using requestAnimationFrame
    requestAnimationFrame(render);
}
var context;
var sourceNode;
var analyser;
var analyser2;
var javascriptNode;
function setupSound() {
    if (!window.AudioContext) {
        if (!window.webkitAudioContext) {
            alert('no audiocontext found');
        }
        window.AudioContext = window.webkitAudioContext;
    }
    context = new AudioContext();
    // setup a javascript node
    javascriptNode = context.createScriptProcessor(1024, 1, 1);
    // connect to destination, else it isn't called
    javascriptNode.connect(context.destination);
    javascriptNode.onaudioprocess = function () {
        // get the average for the first channel
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var lowValue = getAverageVolume(array, 0, 300);
        var midValue = getAverageVolume(array, 301, 600);
        var highValue = getAverageVolume(array, 601, 1000);
        var ps = scene.getObjectByName('ps');
        var geom = ps.geometry;
        var lowOffsets = [];
        var midOffsets = [];
        var highOffsets = [];
        var lowRings = 10;
        var midRings = 10;
        var highRings = 10;
        var midFrom = 12;
        var highFrom = 24;
        var lowVolumeDownScale = 35;
        var midVolumeDownScale = 35;
        var highVolumeDownScale = 35;
        // calculate the rings and offsets for the low sounds, rannge from
        // 0.5 to 0 pi
        for (var i = lowRings; i > 0; i--) {
            lowOffsets.push(Math.sin(Math.PI * (0.5 * (i / lowRings))));
        }
        var lowParticles = [];
        for (var i = 0; i < lowRings; i++) {
            lowParticles.push(getFallOffParticles(centerParticle, (i + 1) * spacing, i * spacing));
        }
        // calculate the rings and offsets for the mid sounds
        // range from 0 to 0.5PI to 0
        for (var i = 0; i < midRings / 2; i++) {
            midOffsets.push(Math.sin(Math.PI * (0.5 * (i / (midRings / 2)))));
        }
        for (var i = midRings / 2; i < midRings; i++) {
            midOffsets.push(Math.sin(Math.PI * (0.5 * (i / (midRings / 2)))));
        }
        var midParticles = [];
        for (var i = 0; i < midRings; i++) {
            midParticles.push(getFallOffParticles(centerParticle, (i + 1 + midFrom) * spacing, (i + midFrom) * spacing));
        }
        // calculate the rings and offsets for the high sounds
        // range from 0 to 0.5PI to 0
        for (var i = 0; i < midRings / 2; i++) {
            highOffsets.push(Math.sin(Math.PI * (0.5 * (i / (highRings / 2)))));
        }
        for (var i = highRings / 2; i < highRings; i++) {
            highOffsets.push(Math.sin(Math.PI * (0.5 * (i / (highRings / 2)))));
        }
        var highParticles = [];
        for (var i = 0; i < highRings; i++) {
            highParticles.push(getFallOffParticles(centerParticle, (i + 1 + highFrom) * spacing, (i + highFrom) * spacing));
        }
        // render the center ring
        renderRing(geom, [centerParticle], lowValue, 1, lowVolumeDownScale);
        // render the other rings for the lowvalue
        for (var i = 0; i < lowRings; i++) {
            renderRing(geom, lowParticles[i], lowValue, lowOffsets[i], lowVolumeDownScale);
        }
        // render the mid ring
        for (var i = 0; i < midRings; i++) {
            renderRing(geom, midParticles[i], midValue, midOffsets[i], midVolumeDownScale);
        }
        // render the high ring
        for (var i = 0; i < highRings; i++) {
            renderRing(geom, highParticles[i], highValue, highOffsets[i], highVolumeDownScale);
        }
        ps.sortParticles = true;
        geom.verticesNeedUpdate = true;
        // clear the current state
        if (scene.getObjectByName('cube')) {
            var cube = scene.getObjectByName('cube');
            var cube2 = scene.getObjectByName('cube2');
            cube.scale.y = average / 20;
            cube2.scale.y = average2 / 20;
        }
    };
    // setup a analyzer
    analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = 0.1;
    analyser.fftSize = 2048;
    // create a buffer source node
    sourceNode = context.createBufferSource();
    var splitter = context.createChannelSplitter();
    // connect the source to the analyser and the splitter
    sourceNode.connect(splitter);
    // connect one of the outputs from the splitter to
    // the analyser
    splitter.connect(analyser, 0, 0);
    // connect the splitter to the javascriptnode
    // we use the javascript node to draw at a
    // specific interval.
    analyser.connect(javascriptNode);
    // and connect to destination
    sourceNode.connect(context.destination);
    context = new AudioContext();
}
function renderRing(geom, particles, value, distanceOffset, volumeDownScale) {
    for (var i = 0; i < particles.length; i++) {
        if (geom.vertices[i]) {
            geom.vertices[particles[i]].y = distanceOffset * value / volumeDownScale;
            geom.colors[particles[i]] = new THREE.Color(scale(distanceOffset * value).hex());
        }
    }
}
function setupParticleSystem(widht, depth) {
    var targetGeometry = new THREE.Geometry();
    for (var i = 0; i < widht; i++) {
        for (var j = 0; j < depth; j++) {
            // position. First part determines spacing, second is offset
            var v = new THREE.Vector3(spacing * (i) - spacing * (widht / 2), 0, spacing * (j) - spacing * (depth / 2));
            targetGeometry.vertices.push(v);
            targetGeometry.colors.push(new THREE.Color(0xffffff));
        }
    }
    var ps = new THREE.ParticleSystem(targetGeometry, pm);
    ps.name = 'ps';
    scene.add(ps);
    centerParticle = getCenterParticle();
}
function getCenterParticle() {
    var center = Math.ceil(particleWidth / 2);
    var centerParticle = center + (center * particleWidth);
    return centerParticle;
}
function getFallOffParticles(center, radiusStart, radiusEnd) {
    var result = [];
    var ps = scene.getObjectByName('ps');
    var geom = ps.geometry;
    var centerParticle = geom.vertices[center];
    var dStart = Math.sqrt(radiusStart * radiusStart + radiusStart * radiusStart);
    var dEnd = Math.sqrt(radiusEnd * radiusEnd + radiusEnd * radiusEnd);
    for (var i = 0; i < geom.vertices.length; i++) {
        var point = geom.vertices[i];
        var xDistance = Math.abs(centerParticle.x - point.x);
        var zDistance = Math.abs(centerParticle.z - point.z);
        var dParticle = Math.sqrt(xDistance * xDistance + zDistance * zDistance);
        if (dParticle < dStart && dParticle >= dEnd && i != center)
            result.push(i);
    }
    return result;
}
function getAverageVolume(array, start, end) {
    var values = 0;
    var average;
    var length = end - start;
    for (var i = start; i < end; i++) {
        values += array[i];
    }
    average = values / length;
    return average;
}
function playSound(buffer) {
    sourceNode.buffer = buffer;
    sourceNode.start(0);
}
// load the specified sound
function loadSound(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    // When loaded decode the data
    request.onload = function () {
        // decode the data
        context.decodeAudioData(request.response, function (buffer) {
            // when the audio is decoded play the sound
            playSound(buffer);
        }, onError);
    };
    request.send();
}
function onError(e) {
    console.log(e);
}
/**
 * Function handles the resize event. This make sure the camera and the renderer
 * are updated at the correct moment.
 */
function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
// calls the init function when the window is done loading.
window.onload = init;
// calls the handleResize function when the window is resized
window.addEventListener('resize', handleResize, false);
