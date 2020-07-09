# giant-audio
web audio是比较复杂的知识点，本次演讲只会说明如何获取音频数据这块，他的其他 api 的使用，可以查看 mdn。
此外，要将音频数据转换成可视化图形，除了了解 Web Audio 之外，css3、svg、canvas2d、WebGL ）有一定了解

## 啥是音频可视化
通过获取频率、波形和其他来自声源的数据，将其转换成图形或图像在屏幕上显示出来，再进行交互处理。
具体来说，这里会通过

## web audio扮演的角色
就是取数据 + 映射数据两个过程，
创建audio context -> 
analyserNode(频率数据|时域数据)analyser.fftSize = 512 快速傅里叶变换的一个参数
fftSize 的要求是 2 的幂次方，比如 256 、 512 等。数字越大，得到的结果越精细。
对于移动端网页来说，本身音频的比特率大多是 128Kbps ，手机屏幕小，因此最终展示图形也不需要每个频率都采到。所以512 是较为合理的值。 ->

设置 SourceNode 三种类型的音频源 MediaElementAudioSourceNode <audio>节点作为输入源
将音频输入关联到一个 AnalyserNode，getByteFrequencyData 返回的是 0 - 255 的 typedArray Uint8Array 

## 开始可视化
心如何将 dataArray 映射为图形数据

### css3方案


### canvas2d方案


### webgl方案