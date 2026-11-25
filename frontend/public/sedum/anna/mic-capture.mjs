class AnnaCapture extends AudioWorkletProcessor {
 buffer=new Float32Array(1024);
 offset=0;
 process(inputs){
  const channel=inputs[0]?.[0];
  if(!channel)return true;
  for(const sample of channel){
   this.buffer[this.offset++]=sample;
   if(this.offset===this.buffer.length){
    this.port.postMessage(this.buffer,[this.buffer.buffer]);
    this.buffer=new Float32Array(1024);
    this.offset=0;
   }
  }
  return true;
 }
}
registerProcessor('anna-capture',AnnaCapture);
