
const cax = window.cax

const $b = document.body

const stage =  new cax.Stage($b.offsetWidth, $b.offsetHeight, 'body')

class Variant extends cax.Group {
  constructor (r=0, fillStyle) {
    super(r,fillStyle)
    this.rect = new cax.Rect(r * 2, r * 2, {fillStyle})
    this.rect.originX = r
    this.rect.originY = r
    this.add(this.rect)
    this.cir = new cax.Circle(r, {fillStyle})
    this.add(this.cir)
    this.rect.visible = this.cir.visible = false
    this.usePolygon('rect')
  }
  usePolygon (s) {
    this.rect.visible = this.cir.visible = false
    this[s].visible = true
  }
}
class Variants extends cax.Group {
  constructor (ars, r = 12, gap = 5, co = 'pink') {
    super()
    this.ars = ars
    this.variants = []
    this.h = 160
    var [ceil, row] = [
      Math.ceil(stage.width / (r * 2 + gap * 1)),
      Math.ceil(stage.height / (r * 2 + gap * 1))
    ]

    for (let i = 0; i < row; i++) {
      for (let j = 0; j < ceil; j++) {
        // let variant = new Variant(r, 'pink')
        let variant = new Variant(r, `hsl(${this.h},100%,70%)`)
        variant.x = j * r * 2 + gap * 2 * j
        variant.y = i * r * 2 + gap * 2 * i
        this.add(variant)
        this.variants.push(variant)
      }
    }
  }

  update (frequencyData, avg) {
    this.h += 0.1
    this.variants.forEach((o, i) => {
      o.scaleY = o.scaleX = 1 + avg * 0.008
      o.rotation += 0.8
      // 'hsl(160,100%,50%)'
      o.children.forEach(polygon => {
        polygon.option.fillStyle = `hsl(${this.h},100%,70%)`
      })
    })
  }
  usePolygon (s, fn) {
    this.variants.forEach((o, i) => {
      o.usePolygon(s)
    })
    fn && fn.call(this)
  }
}
class FrequencyBars extends cax.Group {
  constructor (num, gap, origin = 'center') {
    super()
    this.rects = []
    this.num = num
    var w = (stage.width - gap * (num - 1)) / num
    Array.from({length: num}, (v, i) => {
      var rect = new cax.Rect(w, 50, {
        fillStyle: 'white'
      })
      rect.alpha = 0.666
      rect.scaleY = 0.1
      this.add(rect)
      this.rects.push(rect)
      rect.x = w * i + gap * i
      switch (origin) {
        case 'top':
          rect.originY = 0
          break
        case 'bottom':
          rect.originY = rect.height
      }
    })
  }
  update (frequencyData) {
    let pFrequency = frequencyData.length / this.num | 0
    let frequencyStep = 0
    this.rects.forEach((o, i) => {
      frequencyStep += pFrequency
      var v = Math.abs(frequencyData[frequencyStep]) / 128
      o.scaleY = Math.max(0.1, v * 0.56)
      // console.log(v)
    })
  }
}


var AudioContext = window.AudioContext || window.webkitAudioContext
var analyser, frequencyData
var actx = new AudioContext()
var media = './src/assets/miku.mp3'
// -ab 100k -ar 23k

var loadAudio = (url) => {
  var xhr = new window.XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.responseType = 'arraybuffer'
  return new Promise(resolve => {
    var $precent = document.querySelector('#precent')
    $precent.style.display = 'block'
    xhr.onload = () => {
      $precent.style.display = 'none'
      // resolve(xhr.response)
      analyser = actx.createAnalyser()
      analyser.fftSize = 2048
      analyser.smoothingTimeConstant = 0.8
      actx.decodeAudioData(xhr.response, buffer => {
        var asource = actx.createBufferSource()
        asource.buffer = buffer
        asource.loop = true
        var splitter = actx.createChannelSplitter()
        asource.connect(splitter)
        splitter.connect(analyser, 0, 0)
        analyser.connect(actx.destination)
        // asource.start()
        // resolve()

        resolve(asource)
      })
    }
    xhr.onprogress = (o) => {
      var {loaded, total} = o

      $precent.textContent = Math.round(loaded / total * 100) + '%'
    }
    xhr.send()
  })
}
var getAvg = (frequencyData) => {
  var value = 0
  var values = [].slice.call(frequencyData)
  values.forEach(function (v) {
    value += v
  })
  return value / values.length
}

loadAudio(media).then(asource => {
  var changePolygon = () => {
    var polygon = ++variants.n % 2 === 0 ? 'cir' : 'rect'
    variants.usePolygon(polygon, function () {
      setTimeout(() => {
        changePolygon()
      }, 2333 + Math.random() * 2333)
    })
  }

  var play = false, $play = document.querySelector('#play')
  $play.style.visibility = 'visible'

  var bg = new cax.Rect(stage.width, stage.height, {fillStyle: 'black'})
  stage.add(bg)

  var gap = stage.width * 0.04
  var fqbTop = new FrequencyBars(45, gap, 'top')
  var fqbBot = new FrequencyBars(45, gap, 'bottom')
  // stage.add(fqbTop, fqbBot)
  fqbTop.alpha = 0.5
  fqbBot.alpha = 0.5
  fqbTop.y = 0
  fqbBot.y = stage.height

  // ars, r = 12, gap = 5
  var variants = new Variants(['rect', 'cir'], stage.width * 0.04, stage.width * 0.05)
  variants.alpha = 0.2
  variants.n = 0
  var text = new cax.Text('Miku~', {
    font: '60px Arial',
    color: 'white',
    baseline: 'middle',
    textAlign: 'center'
  })
  text.alpha = 0.6
  text.x = stage.width * 0.5
  text.y = stage.height * 0.5
  text.visible = false
  // text.originX = text.getWidth() * 0.5

  // console.log(text.x, stage.width)
  stage.add(variants)
  stage.add(fqbTop)
  stage.add(fqbBot)
  stage.add(text)

  $play.addEventListener('click', function () {
    this.style.visibility = 'hidden'
    this.style.webkitAnimation = 'none'
    asource.start()
    frequencyData = new Uint8Array(analyser.frequencyBinCount)
    play = true
    text.visible = true
    changePolygon()
  })

  cax.tick(() => {
    stage.update()

    if (play) {
      let avg = getAvg(frequencyData)

      analyser.getByteFrequencyData(frequencyData)
      fqbBot.update(frequencyData.slice(0, frequencyData.length * 0.5 | 0))
      fqbTop.update(frequencyData.slice(0, frequencyData.length * 0.5 | 0))
      variants.update(frequencyData.slice(0, frequencyData.length * 0.5 | 0), avg)
      text.scaleX = text.scaleY = 1 + avg * 0.01
    }
  })
})