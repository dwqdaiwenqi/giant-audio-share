// //initialise simplex noise instance
var  simplex = new SimplexNoise();

// // console.log('xxxxxxxxxx')

// // // the main visualiser function
// var vizInit = function (){

//   var file = document.getElementById("thefile");

//   var audio = document.getElementById("audio");
//   var fileLabel = document.querySelector("label.file");
  
//   document.onload = function(e){
//     console.log(e);
//     audio.play();
//     play();
//   }
//   file.addEventListener('change',function(){
    
//     fileLabel.classList.add('normal');
//     audio.classList.add('active');
//     var files = this.files;
//     audio.src = URL.createObjectURL(files[0]);
//     audio.load();
//     audio.play();
//     play();
//   })
  
// function play() {
//     var context = new AudioContext();
//     var src = context.createMediaElementSource(audio);
//     var analyser = context.createAnalyser();
//     src.connect(analyser);
//     analyser.connect(context.destination);
//     analyser.fftSize = 512;
//     var bufferLength = analyser.frequencyBinCount;
//     var dataArray = new Uint8Array(bufferLength);

//     //here comes the webgl
//     var scene = new THREE.Scene();
//     var group = new THREE.Group();
//     var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
//     camera.position.set(0,0,100);
//     camera.lookAt(scene.position);
//     scene.add(camera);

//     var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);

//     var planeGeometry = new THREE.PlaneGeometry(800, 800, 20, 20);
//     var planeMaterial = new THREE.MeshLambertMaterial({
//         color: 0x6904ce,
//         side: THREE.DoubleSide,
//         wireframe: true
//     });
    
//     var plane = new THREE.Mesh(planeGeometry, planeMaterial);
//     plane.rotation.x = -0.5 * Math.PI;
//     plane.position.set(0, 30, 0);
//     group.add(plane);
    
//     var plane2 = new THREE.Mesh(planeGeometry, planeMaterial);
//     plane2.rotation.x = -0.5 * Math.PI;
//     plane2.position.set(0, -30, 0);
//     group.add(plane2);

//     var icosahedronGeometry = new THREE.IcosahedronGeometry(10, 4);
//     var lambertMaterial = new THREE.MeshLambertMaterial({
//         color: 0xff00ee,
//         wireframe: true
//     });

//     var ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
//     ball.position.set(0, 0, 0);
//     group.add(ball);

//     var ambientLight = new THREE.AmbientLight(0xaaaaaa);
//     scene.add(ambientLight);

//     var spotLight = new THREE.SpotLight(0xffffff);
//     spotLight.intensity = 0.9;
//     spotLight.position.set(-10, 40, 20);
//     spotLight.lookAt(ball);
//     spotLight.castShadow = true;
//     scene.add(spotLight);

//     // var orbitControls = new THREE.OrbitControls(camera);
//     // orbitControls.autoRotate = true;
    
//     scene.add(group);
    

//     document.getElementById('out').appendChild(renderer.domElement);

//     window.addEventListener('resize', onWindowResize, false);

//     render();

//     function render() {
//       analyser.getByteFrequencyData(dataArray);

//       var lowerHalfArray = dataArray.slice(0, (dataArray.length/2) - 1);
//       var upperHalfArray = dataArray.slice((dataArray.length/2) - 1, dataArray.length - 1);

//       var overallAvg = avg(dataArray);
//       var lowerMax = max(lowerHalfArray);
//       var lowerAvg = avg(lowerHalfArray);
//       var upperMax = max(upperHalfArray);
//       var upperAvg = avg(upperHalfArray);

//       var lowerMaxFr = lowerMax / lowerHalfArray.length;
//       var lowerAvgFr = lowerAvg / lowerHalfArray.length;
//       var upperMaxFr = upperMax / upperHalfArray.length;
//       var upperAvgFr = upperAvg / upperHalfArray.length;

//       makeRoughGround(plane, modulate(upperAvgFr, 0, 1, 0.5, 4));
//       makeRoughGround(plane2, modulate(lowerMaxFr, 0, 1, 0.5, 4));
      
//       makeRoughBall(ball, modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8), modulate(upperAvgFr, 0, 1, 0, 4));

//       group.rotation.y += 0.005;
//       renderer.render(scene, camera);
//       requestAnimationFrame(render);
//     }

//     function onWindowResize() {
//         camera.aspect = window.innerWidth / window.innerHeight;
//         camera.updateProjectionMatrix();
//         renderer.setSize(window.innerWidth, window.innerHeight);
//     }

//     function makeRoughBall(mesh, bassFr, treFr) {
//         mesh.geometry.vertices.forEach(function (vertex, i) {
//             var offset = mesh.geometry.parameters.radius;

            
//             vertex.multiplyScalar(offset);
//         });
//         mesh.geometry.verticesNeedUpdate = true;
//         mesh.geometry.normalsNeedUpdate = true;
//         mesh.geometry.computeVertexNormals();
//         mesh.geometry.computeFaceNormals();
//     }



//     audio.play();
//   };
// }

// onload = ()=>{
//   vizInit()
// }


// document.body.addEventListener('touchend', function(ev) { context.resume(); });




// //some helper functions here
// function fractionate(val, minVal, maxVal) {
//     return (val - minVal)/(maxVal - minVal);
// }

// function modulate(val, minVal, maxVal, outMin, outMax) {
//     var fr = fractionate(val, minVal, maxVal);
//     var delta = outMax - outMin;
//     return outMin + (fr * delta);
// }

// function avg(arr){
//     var total = arr.reduce(function(sum, b) { return sum + b; });
//     return (total / arr.length);
// }

// function max(arr){
//     return arr.reduce(function(a, b){ return Math.max(a, b); })
// }




onload = ()=>{

  var context = new(window.AudioContext || window.webkitAudioContext)();
  var analyser = context.createAnalyser();
  analyser.fftSize = 512;
 
   var $audio = document.querySelector('#audio')

   var source = context.createMediaElementSource($audio);
   
   source.connect(analyser);
   analyser.connect(context.destination);
   
   var bufferLength = analyser.frequencyBinCount;
   var dataArray = new Uint8Array(bufferLength); 
   
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0,0,100);
    camera.lookAt(scene.position);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.intensity = 0.9;
    spotLight.position.set(-10, 40, 20);
    spotLight.castShadow = true;
    scene.add(spotLight);

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0,0,100);
    camera.lookAt(scene.position);
    scene.add(camera);

    document.getElementById('out').appendChild(renderer.domElement);

    // IcosahedronGeometry(radius : Float, detail : Integer)
    const radius:number = 10
    var icosahedronGeometry = new THREE.IcosahedronGeometry(radius, 4);
    var lambertMaterial = new THREE.MeshLambertMaterial({
        color: 0xff00ee,
        wireframe: true
      });

    var ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
    ball.position.set(0, 0, 0);
    scene.add(ball)

   setInterval(()=>{
     analyser.getByteFrequencyData(dataArray);

     const frAvg  = 
     Math.pow(
      Math.max(.1,1-avg(dataArray)/(255)),
      2
     )      

     const scale =radius*frAvg*4
     let t = Math.sin( Date.now()*.001)*2-1
     document.title = t

     //document.title = frAvg
      ball.geometry.vertices.forEach( (vertex, i)=> {
        //document.title = `frAvg${frAvg.toFixed(2)},scale${scale}`
        // avg fequency 1 --- 0   nosize 1 --- 0
        // radius 1 ---- 0
        vertex.normalize()
        
        let seed = 0.5 * (simplex.noise3D(
          // vertex.x*radius / scale, 
          // vertex.y*radius / scale, 
          // vertex.z*radius / scale ) + 1
          vertex.x*radius *t*.01, 
          vertex.y*radius *t*.01, 
          vertex.z*radius *t*.01) + 1
        );
          vertex.multiplyScalar(radius*(1-frAvg)+seed*5);
      });

      ball.geometry.verticesNeedUpdate = true;
      ball.geometry.normalsNeedUpdate = true;
      ball.geometry.computeVertexNormals();
      ball.geometry.computeFaceNormals();

      renderer.render(scene, camera);
    
     
   },1000/60)


  function avg(arr){
      var total = arr.reduce(function(sum, b) { return sum + b; });
      return (total / arr.length);
  }

}
  