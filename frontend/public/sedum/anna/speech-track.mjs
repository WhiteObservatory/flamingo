// Kseniya returns mono 16-bit PCM with a 44-byte WAV header.
export function joinSpeech(clips){
 const views=clips.map(x=>new DataView(x));
 const rate=views[0].getUint32(24,true),starts=[];
 let bytes=0;
 for(const v of views){
  if(v.byteLength<=44||v.getUint32(0)!==0x52494646||v.getUint32(36)!==0x64617461||
     v.getUint16(20,true)!==1||v.getUint16(22,true)!==1||v.getUint16(34,true)!==16||
     v.getUint32(24,true)!==rate||v.getUint32(40,true)!==v.byteLength-44)throw Error('Incomplete voice clip');
  starts.push(bytes/(rate*2));bytes+=v.byteLength-44;
 }
 if(clips.length===1)return {wav:clips[0],starts};
 const data=new Uint8Array(44+bytes);data.set(new Uint8Array(clips[0],0,44));
 let pos=44;
 for(const clip of clips){const pcm=new Uint8Array(clip,44);data.set(pcm,pos);pos+=pcm.length;}
 const out=new DataView(data.buffer);out.setUint32(4,bytes+36,true);out.setUint32(40,bytes,true);
 return {wav:data.buffer,starts};
}
