"use strict";
var loadAudio = function (url) {
    var actx = new (window.AudioContext || window.webkitAudioContext)();
    var xhr = new window.XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    return new Promise(function (resolve) {
        xhr.onload = function () {
            var analyser = actx.createAnalyser();
            analyser.fftSize = 512;
            actx.decodeAudioData(xhr.response, function (buffer) {
                var source = actx.createBufferSource();
                source.buffer = buffer;
                source.loop = true;
                var splitter = actx.createChannelSplitter();
                source.connect(splitter);
                splitter.connect(analyser, 0, 0);
                analyser.connect(actx.destination);
                resolve({ analyser: analyser, source: source });
            });
        };
        xhr.onprogress = function (o) {
            var loaded = o.loaded, total = o.total;
            document.title = loaded / total;
        };
        xhr.onerror = function (e) {
            alert(e);
        };
        xhr.send();
    });
};
window.loadAudio = loadAudio;
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
            ctx.fillStyle = 'white';
            ctx.fillRect(points[i].x, points[i].y, 3, 3);
        }
    }
    ctx.quadraticCurveTo(points[points.length - 1].x, points[points.length - 1].y, ctrlPoint1.x, ctrlPoint1.y);
    ctx.stroke();
    ctx.restore();
};
window.drawClosedCurve = drawClosedCurve;
var avg = function (arr) {
    var total = arr.reduce(function (sum, b) { return sum + b; });
    return (total / arr.length);
};
window.avg = avg;
