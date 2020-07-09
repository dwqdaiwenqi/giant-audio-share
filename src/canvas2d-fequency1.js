"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var simplex = new SimplexNoise();
onload = function () {
    var $canvas = document.querySelector('canvas');
    var c = $canvas.getContext('2d');
    var _a = [document.body.offsetWidth, document.body.offsetHeight], width = _a[0], height = _a[1];
    $canvas.width = width;
    $canvas.height = height;
    var getAvg = function (frequencyData) {
        var value = 0;
        var values = [].slice.call(frequencyData);
        values.forEach(function (v) {
            value += v;
        });
        return value / values.length;
    };
    var $mat = document.createElement('img');
    $mat.src = './src/assets/miku-poster.png';
    var matWidth = 300;
    var matHeight = 300;
    var $play = document.querySelector('#play');
    var canPlay = false;
    var dataArray;
    $play.onclick = function () {
        $play.style.display = 'none';
        // const source:MediaElementAudioSourceNode = context.createMediaElementSource($audio);
        // source.connect(analyser);
        // analyser.connect(context.destination);
        // const bufferLength:number = analyser.frequencyBinCount; // half fftSize
        // dataArray = new Uint8Array(bufferLength);
        // canPlay = true
        loadAudio('./src/assets/miku.mp3').then(function (_a) {
            var analyser = _a.analyser, source = _a.source;
            window.analyser = analyser;
            window.source = source;
            source.start();
            dataArray = new Uint8Array(analyser.frequencyBinCount);
            canPlay = true;
        });
    };
    var lineStyle = '#' + Math.floor(Math.random() * 0xffffff).toString(16);
    var lineStyle2 = '#' + Math.floor(Math.random() * 0xffffff).toString(16);
    var rotate = 0;
    requestAnimationFrame(function animate() {
        requestAnimationFrame(animate);
        c.clearRect(0, 0, $canvas.width, $canvas.height);
        c.save();
        c.translate(width * .5, height * .5);
        c.rotate(rotate += .01);
        c.beginPath();
        c.arc(0, 0, 120, 0, Math.PI * 2);
        c.clip();
        c.drawImage($mat, -matWidth * .5, -matHeight * .5, matWidth, matHeight);
        c.restore();
        if (canPlay) {
            analyser.getByteFrequencyData(dataArray);
            var pointsNum_1 = 101;
            drawClosedCurve({
                showPoints: false,
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
                showPoints: false,
                points: __spreadArrays(Array(pointsNum_1)).map(function (v, i) {
                    var frequencyData = dataArray.slice(0, dataArray.length * .5);
                    var frAvg = Math.pow(getAvg(frequencyData) / 255, .5);
                    var x = Math.cos(i / (pointsNum_1) * Math.PI * 2);
                    var y = Math.sin(i / (pointsNum_1) * Math.PI * 2);
                    var noise = simplex.noise3D(x, y, frAvg * 2);
                    var selfRadius = 150 + noise * 20;
                    // 初始坐标为圆参数方程
                    // 噪声进行随机平滑，使用节拍强度作为噪声的偏移量
                    // 多个二次贝塞尔曲线进行平滑连接
                    /////////////////////
                    // // let selfRadius = 150 + t*20
                    // let x = width * .5 + Math.cos(i / (pointsNum ) * Math.PI * 2) * 150
                    // let y = height * .5 + Math.sin(i / (pointsNum ) * Math.PI * 2) * 150
                    return {
                        x: width * .5 + x * selfRadius,
                        y: height * .5 + y * selfRadius
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
};
