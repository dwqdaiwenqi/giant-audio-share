const VerticalRect = ({width,height,map})=>{
  const that = {
    $el:document.createElement('div'),
    $mat:document.createElement('img'),
    x:0,
    y:0,
    scaleY:1,
    init(){
      this.$mat.src = map
      Object.assign(this.$el.style,{
        position:'absolute',
        left:'0px',
        top:'0px',
        width:width+'px',
        height:height+'px'
      })
      
    },
    render(){
      this.$el.style.background = `url(${this.$mat.src})`
      this.$el.style.backgroundPosition = `${-this.x}px 0px`
      this.$el.style.transform = `
        translate3d(${this.x}px,${this.y}px,0) 
        scaleY(${this.scaleY})
      `
    }
  }
  that.init()
  return that
}
const scaleTimeDomain = ({map,width,height,slices,offset})=>{
  const $el:HTMLDivElement = document.createElement('div')
 
  $el.className = 'ScaleTimeDomain-owo'
  Object.assign($el.style,{
    position:'absolute',
    left:'0px',
    top:'0px',
    width:width+'px',
    height:height+'px'
  })

  const elements:any[] = []
  
  const rectWidth:number = width/slices
  Array.from({length:slices},(v,i)=>{
    const rect = VerticalRect({
      width:rectWidth,
      height,
      map
    })
    rect.x = i*rectWidth
    rect.init()

    elements.push(rect)
    $el.appendChild(rect.$el)
  })

  return{
    $el,
    elements,
    offsets:[],
    width,
    height,
    x:0,
    y:0,
    scale:1,
    render(){
      this.elements.forEach((element,i)=>{
        element.render()
        element.scaleY = this.offsets[i]
      })
      this.$el.style.transform = `
        translate3d(${this.x}px,${this.y}px,0) 
        scale(${this.scale})
      `
    },
    run(timeDomainData:Uint8Array){
      this.offsets = Array.from({length:slices},(v,i)=>{
        return timeDomainData[i/slices*timeDomainData.length|0]/255 * 2
      })

    }
  }
}

onload = ()=>{

  const [width,height] = [document.body.offsetWidth,document.body.offsetHeight]
  const timedomain1 = scaleTimeDomain({
    map:'./src/assets/qiuqiu1.png',
    width:300,
    height:300,
    slices:80
  })
  
  document.body.appendChild(timedomain1.$el)

  const timedomain2 = scaleTimeDomain({
    map:'./src/assets/qiuqiu2.png',
    width:300,
    height:300,
    slices:50
  })
  timedomain2.scale = .5
  
  document.body.appendChild(timedomain2.$el)
  
  const $play:HTMLDivElement = document.querySelector('#play')
  const $audio:HTMLAudioElement = document.querySelector('audio')
  const context:AudioContext = new(window.AudioContext || window.webkitAudioContext)();
  const analyser:AnalyserNode = context.createAnalyser()
  analyser.fftSize = 512
  let canPlay:boolean = false
  let timeDomainData:Uint8Array
  
  $play.onclick = ()=>{
    $audio.play()
    
    $play.style.display = 'none'
  
    const source:MediaElementAudioSourceNode = context.createMediaElementSource($audio);
    source.connect(analyser);
    analyser.connect(context.destination);
    timeDomainData = new Uint8Array(analyser.fftSize) 
  
    canPlay = true
  }
  
  
  requestAnimationFrame(function animate(){
    requestAnimationFrame(animate)
    timedomain1.render()
    timedomain1.x = width*.5 - timedomain1.width*.5
    timedomain1.y = 20

    timedomain2.render()
    timedomain2.x = width*.5 - timedomain2.width*.5
    timedomain2.y = 300


    if(canPlay){
      analyser.getByteTimeDomainData(timeDomainData)
      timedomain1.run(timeDomainData)
      timedomain2.run(timeDomainData)
    }
    
  })
}
