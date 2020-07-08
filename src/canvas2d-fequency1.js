"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var cax = window.cax;
var $b = document.body;
var stage = new cax.Stage($b.offsetWidth, $b.offsetHeight, 'body');
var Variant = /** @class */ (function (_super) {
    __extends(Variant, _super);
    function Variant(r, fillStyle) {
        if (r === void 0) { r = 0; }
        var _this = _super.call(this, r, fillStyle) || this;
        _this.rect = new cax.Rect(r * 2, r * 2, { fillStyle: fillStyle });
        _this.rect.originX = r;
        _this.rect.originY = r;
        _this.add(_this.rect);
        _this.cir = new cax.Circle(r, { fillStyle: fillStyle });
        _this.add(_this.cir);
        _this.rect.visible = _this.cir.visible = false;
        _this.usePolygon('rect');
        return _this;
    }
    Variant.prototype.usePolygon = function (s) {
        this.rect.visible = this.cir.visible = false;
        this[s].visible = true;
    };
    return Variant;
}(cax.Group));
var Variants = /** @class */ (function (_super) {
    __extends(Variants, _super);
    function Variants(ars, r, gap, co) {
        if (r === void 0) { r = 12; }
        if (gap === void 0) { gap = 5; }
        if (co === void 0) { co = 'pink'; }
        var _this = _super.call(this) || this;
        _this.ars = ars;
        _this.variants = [];
        _this.h = 160;
        var _a = [
            Math.ceil(stage.width / (r * 2 + gap * 1)),
            Math.ceil(stage.height / (r * 2 + gap * 1))
        ], ceil = _a[0], row = _a[1];
        for (var i = 0; i < row; i++) {
            for (var j = 0; j < ceil; j++) {
                // let variant = new Variant(r, 'pink')
                var variant = new Variant(r, "hsl(" + _this.h + ",100%,70%)");
                variant.x = j * r * 2 + gap * 2 * j;
                variant.y = i * r * 2 + gap * 2 * i;
                _this.add(variant);
                _this.variants.push(variant);
            }
        }
        return _this;
    }
    Variants.prototype.update = function (frequencyData, avg) {
        var _this = this;
        this.h += 0.1;
        this.variants.forEach(function (o, i) {
            o.scaleY = o.scaleX = 1 + avg * 0.008;
            o.rotation += 0.8;
            // 'hsl(160,100%,50%)'
            o.children.forEach(function (polygon) {
                polygon.option.fillStyle = "hsl(" + _this.h + ",100%,70%)";
            });
        });
    };
    Variants.prototype.usePolygon = function (s, fn) {
        this.variants.forEach(function (o, i) {
            o.usePolygon(s);
        });
        fn && fn.call(this);
    };
    return Variants;
}(cax.Group));
var FrequencyBars = /** @class */ (function (_super) {
    __extends(FrequencyBars, _super);
    function FrequencyBars(num, gap, origin) {
        if (origin === void 0) { origin = 'center'; }
        var _this = _super.call(this) || this;
        _this.rects = [];
        _this.num = num;
        var w = (stage.width - gap * (num - 1)) / num;
        Array.from({ length: num }, function (v, i) {
            var rect = new cax.Rect(w, 50, {
                fillStyle: 'white'
            });
            rect.alpha = 0.666;
            rect.scaleY = 0.1;
            _this.add(rect);
            _this.rects.push(rect);
            rect.x = w * i + gap * i;
            switch (origin) {
                case 'top':
                    rect.originY = 0;
                    break;
                case 'bottom':
                    rect.originY = rect.height;
            }
        });
        return _this;
    }
    FrequencyBars.prototype.update = function (frequencyData) {
        var pFrequency = frequencyData.length / this.num | 0;
        var frequencyStep = 0;
        this.rects.forEach(function (o, i) {
            frequencyStep += pFrequency;
            var v = Math.abs(frequencyData[frequencyStep]) / 128;
            o.scaleY = Math.max(0.1, v * 0.56);
            // console.log(v)
        });
    };
    return FrequencyBars;
}(cax.Group));
var AudioContext = window.AudioContext || window.webkitAudioContext;
var analyser, frequencyData;
var actx = new AudioContext();
var media = './src/assets/miku.mp3';
// -ab 100k -ar 23k
var loadAudio = function (url) {
    var xhr = new window.XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    return new Promise(function (resolve) {
        var $precent = document.querySelector('#precent');
        $precent.style.display = 'block';
        xhr.onload = function () {
            $precent.style.display = 'none';
            // resolve(xhr.response)
            analyser = actx.createAnalyser();
            analyser.fftSize = 2048;
            analyser.smoothingTimeConstant = 0.8;
            actx.decodeAudioData(xhr.response, function (buffer) {
                var asource = actx.createBufferSource();
                asource.buffer = buffer;
                asource.loop = true;
                var splitter = actx.createChannelSplitter();
                asource.connect(splitter);
                splitter.connect(analyser, 0, 0);
                analyser.connect(actx.destination);
                // asource.start()
                // resolve()
                resolve(asource);
            });
        };
        xhr.onprogress = function (o) {
            var loaded = o.loaded, total = o.total;
            $precent.textContent = Math.round(loaded / total * 100) + '%';
        };
        xhr.send();
    });
};
var getAvg = function (frequencyData) {
    var value = 0;
    var values = [].slice.call(frequencyData);
    values.forEach(function (v) {
        value += v;
    });
    return value / values.length;
};
loadAudio(media).then(function (asource) {
    var changePolygon = function () {
        var polygon = ++variants.n % 2 === 0 ? 'cir' : 'rect';
        variants.usePolygon(polygon, function () {
            setTimeout(function () {
                changePolygon();
            }, 2333 + Math.random() * 2333);
        });
    };
    var play = false, $play = document.querySelector('#play');
    $play.style.visibility = 'visible';
    var bg = new cax.Rect(stage.width, stage.height, { fillStyle: 'black' });
    stage.add(bg);
    var gap = stage.width * 0.04;
    var fqbTop = new FrequencyBars(45, gap, 'top');
    var fqbBot = new FrequencyBars(45, gap, 'bottom');
    // stage.add(fqbTop, fqbBot)
    fqbTop.alpha = 0.5;
    fqbBot.alpha = 0.5;
    fqbTop.y = 0;
    fqbBot.y = stage.height;
    // ars, r = 12, gap = 5
    var variants = new Variants(['rect', 'cir'], stage.width * 0.04, stage.width * 0.05);
    variants.alpha = 0.2;
    variants.n = 0;
    var text = new cax.Text('Miku~', {
        font: '60px Arial',
        color: 'white',
        baseline: 'middle',
        textAlign: 'center'
    });
    text.alpha = 0.6;
    text.x = stage.width * 0.5;
    text.y = stage.height * 0.5;
    text.visible = false;
    // text.originX = text.getWidth() * 0.5
    // console.log(text.x, stage.width)
    stage.add(variants);
    stage.add(fqbTop);
    stage.add(fqbBot);
    stage.add(text);
    $play.addEventListener('click', function () {
        this.style.visibility = 'hidden';
        this.style.webkitAnimation = 'none';
        asource.start();
        frequencyData = new Uint8Array(analyser.frequencyBinCount);
        play = true;
        text.visible = true;
        changePolygon();
    });
    cax.tick(function () {
        stage.update();
        if (play) {
            var avg_1 = getAvg(frequencyData);
            analyser.getByteFrequencyData(frequencyData);
            fqbBot.update(frequencyData.slice(0, frequencyData.length * 0.5 | 0));
            fqbTop.update(frequencyData.slice(0, frequencyData.length * 0.5 | 0));
            variants.update(frequencyData.slice(0, frequencyData.length * 0.5 | 0), avg_1);
            text.scaleX = text.scaleY = 1 + avg_1 * 0.01;
        }
    });
});
