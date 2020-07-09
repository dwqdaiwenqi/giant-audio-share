interface ILoadAudo{
  (url:string):Promise<ILoadAudoResult>
}
type ILoadAudoResult = {analyser:AnalyserNode,source:AudioBufferSourceNode}
const loadAudio:ILoadAudo = (url:string):Promise<ILoadAudoResult> => {
  const actx:AudioContext = new(window.AudioContext || window.webkitAudioContext)()
  const xhr:XMLHttpRequest = new window.XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.responseType = 'arraybuffer'
  return new Promise((resolve:any) => {
    xhr.onload = () => {
      const analyser:AnalyserNode = actx.createAnalyser()
      analyser.fftSize = 512
      actx.decodeAudioData(xhr.response, (buffer:AudioBuffer) => {
        const source:AudioBufferSourceNode= actx.createBufferSource()
        source.buffer = buffer
        source.loop = true
        const splitter = actx.createChannelSplitter()
        source.connect(splitter)
        splitter.connect(analyser, 0, 0)
        analyser.connect(actx.destination)
        resolve({analyser,source})
      })
    }
    xhr.onprogress = (o) => {
      var {loaded, total} = o
      document.title = loaded/total
    }
    xhr.onerror = (e)=>{
      alert(e)
    }

    xhr.send()
  })
}
window.loadAudio = loadAudio



const drawClosedCurve = ({ points, start, ctx, showPoints }) => {
  const ctrlPoint = {}
  const ctrlPoint1 = {}
  ctrlPoint1.x = (points[0].x + points[points.length - 1].x) * .5
  ctrlPoint1.y = (points[0].y + points[points.length - 1].y) * .5
  ctx.save()
  start(ctx)
  ctx.beginPath()
  ctx.moveTo(ctrlPoint1.x, ctrlPoint1.y)
  for (let i = 0; i < points.length - 1; i++) {
    ctrlPoint.x = (points[i].x + points[i + 1].x) / 2
    ctrlPoint.y = (points[i].y + points[i + 1].y) / 2
    ctx.quadraticCurveTo(points[i].x, points[i].y, ctrlPoint.x, ctrlPoint.y)

    if (showPoints) {
      ctx.fillStyle = 'white'
      ctx.fillRect(points[i].x, points[i].y, 3, 3)
    }
  }
  ctx.quadraticCurveTo(points[points.length - 1].x, points[points.length - 1].y, ctrlPoint1.x, ctrlPoint1.y)
  ctx.stroke()
  ctx.restore()
    
}

window.drawClosedCurve = drawClosedCurve



function avg(arr){
  var total = arr.reduce(function(sum, b) { return sum + b; });
  return (total / arr.length);
 }

 window.avg = avg