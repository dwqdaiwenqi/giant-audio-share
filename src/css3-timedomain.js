"use strict";
var VerticalRect = function (_a) {
    var width = _a.width, height = _a.height, map = _a.map;
    var that = {
        $el: document.createElement('div'),
        $mat: document.createElement('img'),
        x: 0,
        y: 0,
        scaleY: 1,
        init: function () {
            this.$mat.src = map;
            Object.assign(this.$el.style, {
                position: 'absolute',
                left: '0px',
                top: '0px',
                width: width + 'px',
                height: height + 'px'
            });
        },
        render: function () {
            this.$el.style.background = "url(" + this.$mat.src + ")";
            this.$el.style.backgroundPosition = -this.x + "px 0px";
            this.$el.style.transform = "\n        translate3d(" + this.x + "px," + this.y + "px,0) \n        scaleY(" + this.scaleY + ")\n      ";
        }
    };
    that.init();
    return that;
};
var scaleTimeDomain = function (_a) {
    var map = _a.map, width = _a.width, height = _a.height, slices = _a.slices;
    var $el = document.createElement('div');
    $el.className = 'ScaleTimeDomain-owo';
    Object.assign($el.style, {
        position: 'absolute',
        left: '0px',
        top: '0px',
        width: width + 'px',
        height: height + 'px'
    });
    var elements = [];
    var rectWidth = width / slices;
    Array.from({ length: slices }, function (v, i) {
        var rect = VerticalRect({
            width: rectWidth,
            height: height,
            map: map
        });
        rect.x = i * rectWidth;
        rect.init();
        elements.push(rect);
        $el.appendChild(rect.$el);
    });
    return {
        $el: $el,
        elements: elements,
        offsets: [],
        width: width,
        height: height,
        x: 0,
        y: 0,
        scale: 1,
        render: function () {
            var _this = this;
            this.elements.forEach(function (element, i) {
                element.render();
                element.scaleY = _this.offsets[i];
            });
            this.$el.style.transform = "\n        translate3d(" + this.x + "px," + this.y + "px,0) \n        scale(" + this.scale + ")\n      ";
        },
        run: function (timeDomainData) {
            this.offsets = Array.from({ length: slices }, function (v, i) {
                return timeDomainData[i / slices * timeDomainData.length | 0] / 255 * 2;
            });
        }
    };
};
onload = function () {
    var media = './src/assets/miku.mp3';
    var _a = [document.body.offsetWidth, document.body.offsetHeight], width = _a[0], height = _a[1];
    var timedomain1 = scaleTimeDomain({
        map: './src/assets/qiuqiu1.png',
        width: 300,
        height: 300,
        slices: 80
    });
    document.body.appendChild(timedomain1.$el);
    var timedomain2 = scaleTimeDomain({
        map: './src/assets/qiuqiu2.png',
        width: 300,
        height: 300,
        slices: 50
    });
    timedomain2.scale = .5;
    document.body.appendChild(timedomain2.$el);
    var $play = document.querySelector('#play');
    var canPlay = false;
    var timeDomainData;
    $play.onclick = function () {
        $play.style.display = 'none';
        loadAudio(media).then(function (_a) {
            var analyser = _a.analyser, source = _a.source;
            window.source = source;
            window.analyser = analyser;
            source.start();
            timeDomainData = new Uint8Array(analyser.fftSize);
            canPlay = true;
        });
    };
    requestAnimationFrame(function animate() {
        requestAnimationFrame(animate);
        timedomain1.render();
        timedomain1.x = width * .5 - timedomain1.width * .5;
        timedomain1.y = 20;
        timedomain2.render();
        timedomain2.x = width * .5 - timedomain2.width * .5;
        timedomain2.y = 300;
        if (canPlay) {
            analyser.getByteTimeDomainData(timeDomainData);
            timedomain1.run(timeDomainData);
            timedomain2.run(timeDomainData);
        }
    });
};
