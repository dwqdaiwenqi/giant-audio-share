"use strict";
// // // https://kelvinau.github.io/circular-audio-wave/demo/circular-wave.html
// // const cax = window.cax
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
// // const $b = document.body
// // const stage =  new cax.Stage($b.offsetWidth, $b.offsetHeight, 'body')
// // class Variant extends cax.Group {
// //   constructor (r=0, fillStyle) {
// //     super(r,fillStyle)
// //     this.rect = new cax.Rect(r * 2, r * 2, {fillStyle})
// //     this.rect.originX = r
// //     this.rect.originY = r
// //     this.add(this.rect)
// //     this.cir = new cax.Circle(r, {fillStyle})
// //     this.add(this.cir)
// //     this.rect.visible = this.cir.visible = false
// //     this.usePolygon('rect')
// //   }
// //   usePolygon (s) {
// //     this.rect.visible = this.cir.visible = false
// //     this[s].visible = true
// //   }
// // }
// // class Variants extends cax.Group {
// //   constructor (ars, r = 12, gap = 5, co = 'pink') {
// //     super()
// //     this.ars = ars
// //     this.variants = []
// //     this.h = 160
// //     var [ceil, row] = [
// //       Math.ceil(stage.width / (r * 2 + gap * 1)),
// //       Math.ceil(stage.height / (r * 2 + gap * 1))
// //     ]
// //     for (let i = 0; i < row; i++) {
// //       for (let j = 0; j < ceil; j++) {
// //         // let variant = new Variant(r, 'pink')
// //         let variant = new Variant(r, `hsl(${this.h},100%,70%)`)
// //         variant.x = j * r * 2 + gap * 2 * j
// //         variant.y = i * r * 2 + gap * 2 * i
// //         this.add(variant)
// //         this.variants.push(variant)
// //       }
// //     }
// //   }
// //   update (frequencyData, avg) {
// //     this.h += 0.1
// //     this.variants.forEach((o, i) => {
// //       o.scaleY = o.scaleX = 1 + avg * 0.008
// //       o.rotation += 0.8
// //       // 'hsl(160,100%,50%)'
// //       o.children.forEach(polygon => {
// //         polygon.option.fillStyle = `hsl(${this.h},100%,70%)`
// //       })
// //     })
// //   }
// //   usePolygon (s, fn) {
// //     this.variants.forEach((o, i) => {
// //       o.usePolygon(s)
// //     })
// //     fn && fn.call(this)
// //   }
// // }
// // class FrequencyBars extends cax.Group {
// //   constructor (num, gap, origin = 'center') {
// //     super()
// //     this.rects = []
// //     this.num = num
// //     var w = (stage.width - gap * (num - 1)) / num
// //     Array.from({length: num}, (v, i) => {
// //       var rect = new cax.Rect(w, 50, {
// //         fillStyle: 'white'
// //       })
// //       rect.alpha = 0.666
// //       rect.scaleY = 0.1
// //       this.add(rect)
// //       this.rects.push(rect)
// //       rect.x = w * i + gap * i
// //       switch (origin) {
// //         case 'top':
// //           rect.originY = 0
// //           break
// //         case 'bottom':
// //           rect.originY = rect.height
// //       }
// //     })
// //   }
// //   update (frequencyData) {
// //     let pFrequency = frequencyData.length / this.num | 0
// //     let frequencyStep = 0
// //     this.rects.forEach((o, i) => {
// //       frequencyStep += pFrequency
// //       var v = Math.abs(frequencyData[frequencyStep]) / 128
// //       o.scaleY = Math.max(0.1, v * 0.56)
// //       // console.log(v)
// //     })
// //   }
// // }
// // var AudioContext = window.AudioContext || window.webkitAudioContext
// // var analyser, frequencyData
// // var actx = new AudioContext()
// // var media = './src/assets/miku.mp3'
// // // -ab 100k -ar 23k
// // var loadAudio = (url) => {
// //   var xhr = new window.XMLHttpRequest()
// //   xhr.open('GET', url, true)
// //   xhr.responseType = 'arraybuffer'
// //   return new Promise(resolve => {
// //     var $precent = document.querySelector('#precent')
// //     $precent.style.display = 'block'
// //     xhr.onload = () => {
// //       $precent.style.display = 'none'
// //       // resolve(xhr.response)
// //       analyser = actx.createAnalyser()
// //       analyser.fftSize = 2048
// //       analyser.smoothingTimeConstant = 0.8
// //       actx.decodeAudioData(xhr.response, buffer => {
// //         var asource = actx.createBufferSource()
// //         asource.buffer = buffer
// //         asource.loop = true
// //         var splitter = actx.createChannelSplitter()
// //         asource.connect(splitter)
// //         splitter.connect(analyser, 0, 0)
// //         analyser.connect(actx.destination)
// //         // asource.start()
// //         // resolve()
// //         resolve(asource)
// //       })
// //     }
// //     xhr.onprogress = (o) => {
// //       var {loaded, total} = o
// //       $precent.textContent = Math.round(loaded / total * 100) + '%'
// //     }
// //     xhr.send()
// //   })
// // }
// // var getAvg = (frequencyData) => {
// //   var value = 0
// //   var values = [].slice.call(frequencyData)
// //   values.forEach(function (v) {
// //     value += v
// //   })
// //   return value / values.length
// // }
// // loadAudio(media).then(asource => {
// //   var changePolygon = () => {
// //     var polygon = ++variants.n % 2 === 0 ? 'cir' : 'rect'
// //     variants.usePolygon(polygon, function () {
// //       setTimeout(() => {
// //         changePolygon()
// //       }, 2333 + Math.random() * 2333)
// //     })
// //   }
// //   var play = false, $play = document.querySelector('#play')
// //   $play.style.visibility = 'visible'
// //   var bg = new cax.Rect(stage.width, stage.height, {fillStyle: 'black'})
// //   stage.add(bg)
// //   var gap = stage.width * 0.04
// //   var fqbTop = new FrequencyBars(45, gap, 'top')
// //   var fqbBot = new FrequencyBars(45, gap, 'bottom')
// //   // stage.add(fqbTop, fqbBot)
// //   fqbTop.alpha = 0.5
// //   fqbBot.alpha = 0.5
// //   fqbTop.y = 0
// //   fqbBot.y = stage.height
// //   // ars, r = 12, gap = 5
// //   var variants = new Variants(['rect', 'cir'], stage.width * 0.04, stage.width * 0.05)
// //   variants.alpha = 0.2
// //   variants.n = 0
// //   var text = new cax.Text('Miku~', {
// //     font: '60px Arial',
// //     color: 'white',
// //     baseline: 'middle',
// //     textAlign: 'center'
// //   })
// //   text.alpha = 0.6
// //   text.x = stage.width * 0.5
// //   text.y = stage.height * 0.5
// //   text.visible = false
// //   // text.originX = text.getWidth() * 0.5
// //   // console.log(text.x, stage.width)
// //   stage.add(variants)
// //   stage.add(fqbTop)
// //   stage.add(fqbBot)
// //   stage.add(text)
// //   $play.addEventListener('click', function () {
// //     this.style.visibility = 'hidden'
// //     this.style.webkitAnimation = 'none'
// //     asource.start()
// //     frequencyData = new Uint8Array(analyser.frequencyBinCount)
// //     play = true
// //     text.visible = true
// //     changePolygon()
// //   })
// //   cax.tick(() => {
// //     stage.update()
// //     if (play) {
// //       let avg = getAvg(frequencyData)
// //       analyser.getByteFrequencyData(frequencyData)
// //       fqbBot.update(frequencyData.slice(0, frequencyData.length * 0.5 | 0))
// //       fqbTop.update(frequencyData.slice(0, frequencyData.length * 0.5 | 0))
// //       variants.update(frequencyData.slice(0, frequencyData.length * 0.5 | 0), avg)
// //       text.scaleX = text.scaleY = 1 + avg * 0.01
// //     }
// //   })
// // })
// // Set up audio context
// window.AudioContext = window.AudioContext || window.webkitAudioContext;
// const audioContext = new AudioContext();
// /**
//  * Retrieves audio from an external source, the initializes the drawing function
//  * @param {String} url the url of the audio we'd like to fetch
//  */
// const drawAudio = url => {
//   fetch(url)
//     .then(response => response.arrayBuffer())
//     .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
//     .then(audioBuffer => draw(normalizeData(filterData(audioBuffer))));
// };
// /**
//  * Filters the AudioBuffer retrieved from an external source
//  * @param {AudioBuffer} audioBuffer the AudioBuffer from drawAudio()
//  * @returns {Array} an array of floating point numbers
//  */
// const filterData = audioBuffer => {
//   const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
//   const samples = 70; // Number of samples we want to have in our final data set
//   const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
//   const filteredData = [];
//   for (let i = 0; i < samples; i++) {
//     let blockStart = blockSize * i; // the location of the first sample in the block
//     let sum = 0;
//     for (let j = 0; j < blockSize; j++) {
//       console.log(rawData[blockStart + j])
//       sum = sum + Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
//     }
//     filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
//   }
//   return filteredData;
// };
// /**
//  * Normalizes the audio data to make a cleaner illustration 
//  * @param {Array} filteredData the data from filterData()
//  * @returns {Array} an normalized array of floating point numbers
//  */
// const normalizeData = filteredData => {
//     const multiplier = Math.pow(Math.max(...filteredData), -1);
//     return filteredData.map(n => n * multiplier);
// }
// /**
//  * Draws the audio file into a canvas element.
//  * @param {Array} normalizedData The filtered array returned from filterData()
//  * @returns {Array} a normalized array of data
//  */
// const draw = normalizedData => {
//   // set up the canvas
//   const canvas = document.querySelector("canvas");
//   const dpr = window.devicePixelRatio || 1;
//   const padding = 20;
//   canvas.width = 512
//   canvas.height = 512
//   const ctx = canvas.getContext("2d");
//   // draw the line segments
//   const width = canvas.offsetWidth / normalizedData.length;
//   for (let i = 0; i < normalizedData.length; i++) {
//     const x = width * i;
//     let height = normalizedData[i] * canvas.offsetHeight - padding;
//     if (height < 0) {
//         height = 0;
//     } else if (height > canvas.offsetHeight / 2) {
//         height = canvas.offsetHeight / 2;
//     }
//     drawLineSegment(ctx, x, height, width, (i + 1) % 2);
//   }
// };
// /**
//  * A utility function for drawing our line segments
//  * @param {AudioContext} ctx the audio context 
//  * @param {number} x  the x coordinate of the beginning of the line segment
//  * @param {number} height the desired height of the line segment
//  * @param {number} width the desired width of the line segment
//  * @param {boolean} isEven whether or not the segmented is even-numbered
//  */
// const drawLineSegment = (ctx, x, height, width, isEven) => {
//   ctx.lineWidth = 1; // how thick the line is
//   ctx.strokeStyle = "#000"; // what color our line is
//   ctx.beginPath();
//   height = isEven ? height : -height;
//   ctx.moveTo(x, 0);
//   ctx.lineTo(x, height);
//   ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven);
//   ctx.lineTo(x + width, 0);
//   ctx.stroke();
// };
// drawAudio('./src/assets/miku.mp3');
var simplex = new SimplexNoise();
onload = function () {
    var $canvas = document.querySelector('canvas');
    var c = $canvas.getContext('2d');
    var _a = [document.body.offsetWidth, document.body.offsetHeight], width = _a[0], height = _a[1];
    $canvas.width = width;
    $canvas.height = height;
    var FrequencyCircle = function (_a) {
        var radius = _a.radius, segment = _a.segment, strokeStyle = _a.strokeStyle;
        return {
            x: 0,
            y: 0,
            radius: radius,
            segment: segment,
            offsets: __spreadArrays(Array(segment)).map(function () { return 0; }),
            strokeStyle: strokeStyle,
            drawSegment: function (c, radius, radian, delta) {
            },
            wave: function (frequencyData) {
                var _this = this;
                frequencyData = frequencyData.slice(0, frequencyData.length * .5);
                this.offsets = this.offsets.map(function (val, i) {
                    return frequencyData[i / _this.offsets.length * frequencyData.length | 0] / 255;
                });
            },
            render: function (c) {
                var _a;
                c.save();
                c.translate(this.x, this.y);
                c.beginPath();
                var _b = [3, 30], w = _b[0], h = _b[1];
                for (var i = 0; i < segment; i++) {
                    var offset = (_a = this.offsets[i], (_a !== null && _a !== void 0 ? _a : 0));
                    var radian = i / (segment - 1) * Math.PI * 2;
                    var scale_1 = Math.pow(Math.max(.01, offset), .3) * 2;
                    var x1 = Math.cos((radian) * .5 - Math.PI * .5) * (radius);
                    var y1 = Math.sin((radian) * .5 - Math.PI * .5) * (radius);
                    c.save();
                    c.shadowColor = 'rgba(255,255,255,.8)';
                    c.fillStyle = this.strokeStyle;
                    c.translate(x1, y1);
                    c.rotate(Math.atan2(y1, x1) + Math.PI * .5);
                    c.scale(1, scale_1);
                    c.translate(-w * .5, -h * 1);
                    c.beginPath();
                    c.fillRect(0, 0, w, h);
                    c.closePath();
                    c.restore();
                    var x1 = -Math.cos((radian) * .5 - Math.PI * .5) * (radius);
                    var y1 = Math.sin((radian) * .5 - Math.PI * .5) * (radius);
                    c.save();
                    c.shadowColor = 'rgba(255,255,255,.8)';
                    c.fillStyle = this.strokeStyle;
                    c.translate(x1, y1);
                    c.rotate(Math.atan2(y1, x1) + Math.PI * .5);
                    c.scale(1, scale_1);
                    c.translate(-w * .5, -h * 1);
                    c.beginPath();
                    c.fillRect(0, 0, w, h);
                    c.closePath();
                    c.restore();
                }
                c.restore();
            }
        };
    };
    var circle = FrequencyCircle({
        radius: innerWidth * .3,
        segment: 60,
        strokeStyle: '#' + ((Math.random() * 0xffffff) | 0).toString(16)
    });
    circle.x = width * .5;
    circle.y = height * .5;
    var getAvg = function (frequencyData) {
        var value = 0;
        var values = [].slice.call(frequencyData);
        values.forEach(function (v) {
            value += v;
        });
        return value / values.length;
    };
    var $play = document.querySelector('#play');
    var $audio = document.querySelector('audio');
    var context = new (window.AudioContext || window.webkitAudioContext)();
    var analyser = context.createAnalyser();
    analyser.fftSize = 512;
    var canPlay = false;
    var dataArray;
    $play.onclick = function () {
        $audio.play();
        $play.style.display = 'none';
        var source = context.createMediaElementSource($audio);
        source.connect(analyser);
        analyser.connect(context.destination);
        var bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        // analyser.getByteFrequencyData(dataArray)
        canPlay = true;
    };
    var lineStyle = '#' + Math.floor(Math.random() * 0xffffff).toString(16);
    var lineStyle2 = '#' + Math.floor(Math.random() * 0xffffff).toString(16);
    requestAnimationFrame(function animate() {
        requestAnimationFrame(animate);
        c.clearRect(0, 0, $canvas.width, $canvas.height);
        //circle.render(c)
        if (canPlay) {
            analyser.getByteFrequencyData(dataArray);
            var pointsNum_1 = 101;
            drawClosedCurve({
                showPoints: true,
                points: __spreadArrays(Array(pointsNum_1)).map(function (v, i) {
                    var frequencyData = dataArray.slice(0, dataArray.length * .5);
                    var frAvg = Math.pow(getAvg(frequencyData) / 255, .3);
                    var t = simplex.noise3D(Math.cos(i / (pointsNum_1) * Math.PI * 2), Math.sin(i / (pointsNum_1) * Math.PI * 2), frAvg * 2);
                    var selfRadius = 140 + t * 20;
                    var x = width * .5 + Math.cos(i / (pointsNum_1) * Math.PI * 2) * selfRadius;
                    var y = height * .5 + Math.sin(i / (pointsNum_1) * Math.PI * 2) * selfRadius;
                    return {
                        x: x, y: y
                    };
                }),
                ctx: c,
                start: function (ctx) {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = 'rgba(255,255,255,.8)';
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = lineStyle2;
                }
            });
            drawClosedCurve({
                showPoints: true,
                points: __spreadArrays(Array(pointsNum_1)).map(function (v, i) {
                    var frequencyData = dataArray.slice(0, dataArray.length * .5);
                    var frAvg = Math.pow(getAvg(frequencyData) / 255, .5);
                    var t = simplex.noise3D(Math.cos(i / (pointsNum_1) * Math.PI * 2), Math.sin(i / (pointsNum_1) * Math.PI * 2), frAvg * 2);
                    var selfRadius = 150 + t * 20;
                    var x = width * .5 + Math.cos(i / (pointsNum_1) * Math.PI * 2) * selfRadius;
                    var y = height * .5 + Math.sin(i / (pointsNum_1) * Math.PI * 2) * selfRadius;
                    return {
                        x: x, y: y
                    };
                }),
                ctx: c,
                start: function (ctx) {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = 'rgba(255,255,255,.8)';
                    ctx.lineWidth = 5;
                    ctx.strokeStyle = lineStyle;
                }
            });
        }
    });
    // window.rad = 0
    // onmousemove = (e)=>{
    //   var [x,y] = [e.pageX,e.pageY]
    //   window.rad = Math.atan2(
    //     (e.pageY - document.body.offsetHeight*.5),
    //     (e.pageX - document.body.offsetWidth*.5)
    //   )+Math.PI*.5
    //   console.log(window.rad)
    // }
    var drawClosedCurve = function (_a) {
        var points = _a.points, start = _a.start, ctx = _a.ctx, showPoints = _a.showPoints;
        var ctrlPoint = {};
        var ctrlPoint1 = {};
        ctrlPoint1.x = (points[0].x + points[points.length - 1].x) * .5;
        ctrlPoint1.y = (points[0].y + points[points.length - 1].y) * .5;
        ctx.save();
        start(ctx);
        ctx.beginPath();
        ctx.moveTo(ctrlPoint1.x, ctrlPoint1.y);
        for (var i = 0; i < points.length - 1; i++) {
            ctrlPoint.x = (points[i].x + points[i + 1].x) / 2;
            ctrlPoint.y = (points[i].y + points[i + 1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, ctrlPoint.x, ctrlPoint.y);
            if (showPoints) {
                c.fillRect(points[i].x, points[i].y, 3, 3);
            }
        }
        c.quadraticCurveTo(points[points.length - 1].x, points[points.length - 1].y, ctrlPoint1.x, ctrlPoint1.y);
        ctx.stroke();
        ctx.restore();
    };
};
