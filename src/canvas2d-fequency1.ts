
var simplex = new SimplexNoise()
onload = ()=>{
  const $canvas:HTMLCanvasElement = document.querySelector('canvas')
  const c:CanvasRenderingContext2D = $canvas.getContext('2d') as CanvasRenderingContext2D
  const [width,height] = [document.body.offsetWidth,document.body.offsetHeight]
  $canvas.width  =width
  $canvas.height = height

  var getAvg = (frequencyData) => {
    var value = 0
    var values = [].slice.call(frequencyData)
    values.forEach(function (v) {
      value += v
    })
    return value / values.length
  }


  const $mat = document.createElement('img')
  $mat.src = './src/assets/hutao-poster.jpeg'
  const matWidth = 300
  const matHeight = 300

  const $play:HTMLDivElement = document.querySelector('#play')

  let canPlay:boolean = false
  let dataArray:Uint8Array
 

  $play.onclick = ()=>{
   
    $play.style.display = 'none'

    loadAudio('./src/assets/miku.mp3').then(({analyser,source})=>{
      window.analyser = analyser
      window.source = source
      source.start()
      dataArray = new Uint8Array(analyser.frequencyBinCount);
      canPlay = true

    })
  
  }

  const lineStyle = '#'+Math.floor(Math.random()*0xffffff).toString(16)
  const lineStyle2 = '#'+Math.floor(Math.random()*0xffffff).toString(16)
  
  let rotate = 0
  requestAnimationFrame(function animate(){
    requestAnimationFrame(animate)
  
    c.clearRect(0,0,$canvas.width,$canvas.height)

    c.save()
    c.translate(width*.5, height*.5)
    c.rotate(rotate+=.01)
    c.beginPath()
    c.arc(0,0, 120,0,Math.PI*2)
    c.clip()
    c.drawImage($mat, -matWidth*.5, -matHeight*.5, matWidth, matHeight)

    c.restore()

    if(canPlay){
      
      analyser.getByteFrequencyData(dataArray)

      const pointsNum = 101
      drawClosedCurve({
        showPoints: false,
        points: [...Array(pointsNum)].map((v, i) => {

          var frequencyData = dataArray.slice(0,dataArray.length*.5)
        
          var frAvg = Math.pow(getAvg(frequencyData)/255,.3)

          let t = simplex.noise3D(
            Math.cos(i / (pointsNum ) * Math.PI * 2),
            Math.sin(i / (pointsNum ) * Math.PI * 2),
            frAvg*2
          )
          let selfRadius = 140 + t*20
          let x = width * .5 + Math.cos(i / (pointsNum ) * Math.PI * 2) * selfRadius
          let y = height * .5 + Math.sin(i / (pointsNum ) * Math.PI * 2) * selfRadius

          return {
            x, y
          }
        }),
        ctx: c,
        start(ctx) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(255,255,255,.8)'
          ctx.lineWidth = 3
          ctx.strokeStyle = lineStyle2
        }
      })

      drawClosedCurve({
        showPoints: false,
        points: [...Array(pointsNum)].map((v, i) => {

          var frequencyData = dataArray.slice(0,dataArray.length*.5)
        
          const frAvg:number = Math.pow(getAvg(frequencyData)/255,.5)
          
          const x:number = Math.cos(i / (pointsNum ) * Math.PI * 2)
          const y:number = Math.sin(i / (pointsNum ) * Math.PI * 2)
          
          const noise:number = simplex.noise3D(
            x,
            y,
            frAvg*2
          )
          let selfRadius = 150 + noise*20

          return {
            x:width * .5 + x * selfRadius, 
            y:height * .5 + y * selfRadius
          }
        }),
        ctx: c,
        start(ctx) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(255,255,255,.8)'
          ctx.lineWidth = 5
          ctx.strokeStyle = lineStyle
        }
      })
    }
  })
}