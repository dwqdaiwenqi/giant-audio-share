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
        var bufferLength = analyser.frequencyBinCount; // half fftSize
        dataArray = new Uint8Array(bufferLength);
        canPlay = true;
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
