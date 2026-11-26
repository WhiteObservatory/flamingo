import {createTutor,labels} from './tutor-guard.mjs';
export function lessonWelcome({student='',group=false,first=false,newcomer=''}={}){
 const name=value=>value.trim().replace(/[^\p{L}\p{M} -]/gu,'').slice(0,45).trim();
 const pupil=name(student), guest=group?name(newcomer):'';
 const lines=[group?'Привет, ребята!':pupil?`Привет, ${pupil}!`:'Привет!'];
 if(group&&guest)lines.push(`Сегодня к нам присоединился новый ученик: ${guest}. ${guest}, меня зовут Анна, я учитель математики. Ребята, давайте поздороваемся!`);
 else if(first)lines.push('Меня зовут Анна, я учитель математики.');
 lines.push(group?'Как у вас настроение?':'Как у тебя настроение?');
 return lines.join(' ');
}
export function lessonTopic({group=false,homework=false,mood=''}={}){
 const tired=/устал|грустно|плохо|не очень|тяжело/i.test(mood);
 const lines=[tired?'Спасибо за честный ответ. Начнём спокойно, без спешки.':'Спасибо за ответ!'];
 lines.push('Сегодня на математике разберём, что означает дробь: как найти целое, посчитать равные части и записать закрашенную долю. Если что-то непонятно, задавай'+(group?'те':'')+' вопросы.');
 if(homework)lines.push('Перед темой разберём один пример из домашнего задания.');
 else lines.push(group?'Давайте приступим.':'Давай приступим.');
 return lines.join(' ');
}
export async function isWelcomeStop(text){return await createTutor({}).send(text)===labels.stop;}
export const repeatSpeech='Я не расслышала ответ. Повтори, пожалуйста, или напиши его.';
export const confirmDifficulty='Тебе помочь с этим примером?';
export function difficultyVoice(text,pending=false){
 const clean=text.toLowerCase().replace(/ё/g,'е').replace(/[,.!?;:—–]/g,' ').replace(/\s+/g,' ').trim();
 if(pending){
  if(/^(?:нет(?: спасибо| не тяжело| не надо| (?:я )?попробую сам[а]?)?|не тяжело|(?:я )?попробую сам[а]?|(?:пока )?не надо(?: помогать)?|(?:я )?хочу попробовать сам[а]?)$/.test(clean))return 'continue';
  if(/^(?:да(?: мне тяжело| пожалуйста| помоги(?: мне| пожалуйста)?)?|мне тяжело|помоги(?: мне| пожалуйста)?|можно подсказку|подскажи(?: пожалуйста)?|давай вместе)$/.test(clean))return 'help';
  return 'clarify';
 }
 return /^(?:мне(?: сейчас)? тяжело|не тяжело)$/.test(clean)?'clarify':null;
}
export function spokenMath(text){
 const normal=['ноль','один','два','три','четыре','пять','шесть','семь','восемь','девять','десять'];
 const gen=['нуля','одного','двух','трёх','четырёх','пяти','шести','семи','восьми','девяти','десяти'];
 const ordinal=['','','вторая','третья','четвёртая','пятая','шестая','седьмая','восьмая','девятая','десятая'];
 const plural=['','','вторых','третьих','четвёртых','пятых','шестых','седьмых','восьмых','девятых','десятых'];
 const said=(n,table,fallback=normal)=>table[Number(n)]??fallback[Number(n)]??[...n].map(x=>normal[Number(x)]).join(' ');
 return text.replace(/\b(\d+)\s*\/\s*(\d+)\b/g,(_,n,d)=>{
  if(!ordinal[d])return said(n,normal)+' из '+said(d,gen);
  if(n==='1')return d==='3'?'одна треть':'одна '+ordinal[d];
  return (n==='2'?'две':said(n,normal))+' '+plural[d];
 }).replace(/(из\s+)(\d+)/gi,(_,prefix,n)=>prefix+said(n,gen))
 .replace(/\b([12])(?=\s+(?:равн[^ ]*\s+част|част|закрашен))/gi,(_,n)=>n==='1'?'одна':'две')
 .replace(/\d+/g,n=>said(n,normal));
}
export async function voiceTurn(tutor,result){
 if(tutor.snapshot().done)return null;
 const recognized=result?.transcript?.trim();
 const ex=tutor.example?.();
 const recognizableMath=recognized&&(fraction(recognized)?.[1]>0||(ex&&evidence(recognized,ex.n,ex.d)));
 const threshold=result?.local===true&&recognizableMath ? .60 : .65;
 if(!recognized || !/[\p{L}\p{N}]/u.test(recognized.replace(/\[[^\]]*\]|\([^)]*\)/g,'')) || result.isFinal===false || !Number.isFinite(result.confidence) || result.confidence<threshold ||
 /^(?:один|одна|два|две|три|четыре|пять|шесть|\d+)(?:\s*(?:\/|из))?\s*[.!…]*$/i.test(result.transcript.trim()))
  return {teacher:repeatSpeech};
 const student=recognized;
 if(tutor.expectsFraction?.()&&ex?.d){
  // Only for ASR in a share-of-a-whole question. Never rewrite typed arithmetic.
  const pair=student.match(/^(\d+)[-/](\d+)[.!?,; ]+ой[,.!\s]+нет[,.!\s]+(\d+)-(\d+)[.!]?$/iu);
  if(pair&&+pair[2]===ex.d&&+pair[4]===ex.d&&+pair[1]<=ex.d&&+pair[3]<=ex.d)
   return {student,teacher:await tutor.send(pair[3]+'/'+pair[4])};
  if(/\d\s*[-−–]\s*\d|минус|вычесть|вычитание/iu.test(student)&&!fraction(selfCorrection(student)))
   return {student,teacher:'Ты называешь дробь или вычитаешь? Если дробь, скажи, например, «одна треть».'};
 }
 return {student,teacher:await tutor.send(student)};
}
const items=[
 {title:'Полоску разделили на пять равных частей. Две закрасили.',n:2,d:5},
 {title:'Ленту разделили на шесть равных частей. Три закрасили.',n:3,d:6}
];
const why='Что означают верхнее и нижнее числа в этой записи?';
const symbols={одна:1,две:2,три:3,четыре:4,пять:5,шесть:6,один:1,два:2,двух:2,трех:3,четырех:4,пяти:5,шести:6};
const normalize=s=>s.toLowerCase().replaceAll('ё','е').trim();
function fraction(s){
 s=normalize(s).replace(/^(?:ответ|это|думаю,? что)\s*[:—-]?\s+/,'');
 s=s.replace(/^(одна|две|три|четыре|пять|шесть)[-–](?=[а-я])/,'$1 ');
 const m=s.match(/^\s*(\d+)\s*[/⁄]\s*(\d+)\s*[.!]?$/);
 if(m)return m.slice(1).map(Number);
 const w=s.toLowerCase().trim().match(/^(одна|две|три)\s+(пятая|пятых|шестая|шестых|вторая|вторых)[.!]?$/);
 if(w)return [symbols[w[1]],{пятая:5,пятых:5,шестая:6,шестых:6,вторая:2,вторых:2}[w[2]]];
 if(/^(?:половина|одна вторая|полоски половина)[.!]?$/i.test(s.trim()))return [1,2];
 if(/^одна треть[.!]?$/i.test(s.trim()))return [1,3];
 const part=s.match(/^(\d+|одна|две|три|четыре|пять|шесть|один|два) из (\d+|двух|трех|четырех|пяти|шести)[.!]?$/);
 if(part)return [symbols[part[1]]??Number(part[1]),{двух:2,трех:3,четырех:4,пяти:5,шести:6}[part[2]]??Number(part[2])];
}
function evidence(text,n,d){
 if(/(?:^|\s)(?:не|нет|или|либо)(?:[\s,.!?]|$)/i.test(text))return false;
 const s=normalize(text).replace(/[.,;!?]/g,' ').replace(/\s+/g,' ');
 const count='(\\d+|одна|две|три|четыре|пять|шесть|один|два)';
 const match=s.match(new RegExp('^'+count+' (?:част[ьи] |частей )?закрашен[оыа]? '+count+' (?:равных )?(?:частей |части )?всего\\s*$'));
 const reverse=s.match(new RegExp('^всего '+count+' (?:равных )?(?:частей |части )?закрашен[оыа]? '+count+'(?: (?:частей|части|часть))?\\s*$'));
 const read=x=>symbols[x]??Number(x);
 const child=s.trim().match(new RegExp('^'+count+' [—–-]?\\s*(?:это )?все равные (?:кусочки|части|частички) а '+count+' мы (?:закрасили|раскрасили)$'));
 if(child)return read(child[1])===d&&read(child[2])===n;
 if((match&&read(match[1])===n&&read(match[2])===d)||(reverse&&read(reverse[2])===n&&read(reverse[1])===d))return true;
 const qty='(\\d+|одна|один|две|два|три|четыре|пять|шесть|двух|трех|четырех|пяти|шести)';
 const fromWhole=s.match(new RegExp('^из '+qty+' равных (?:частей|отрезков) (?:закрашен[оыа]?|закрасили) '+qty+'(?: (?:часть|части|частей|отрезок))?\\s*$'));
 if(fromWhole)return read(fromWhole[1])===d&&read(fromWhole[2])===n;
 const fromMarked=s.match(new RegExp('^'+qty+' закрашенн(?:ая|ый|ые|ых) (?:часть|части|частей|отрезок|отрезка) из '+qty+' равных(?: (?:частей|отрезков))?\\s*$'));
 if(fromMarked)return read(fromMarked[1])===n&&read(fromMarked[2])===d;
 const clauses=normalize(text).split(/[,.;!]|\s+а\s+|\s+и\s+(?=всего|снизу|сверху|внизу|вверху|закраш)|\s+(?=всего\s+\S)/);
 const top=new Set(),bottom=new Set();
 for(const clause of clauses){
  const c=clause.trim().replace(/^(?:потому что|из них|из которых)\s+/,'').replace(/[–—]/g,' ').replace(/\s+/g,' ');
  const marked=c.match(new RegExp('^(?:(?:сверху|вверху|числитель)\\s*[:—-]?\\s*)?(?:(?:закрашен[оыа]?|закрасили) '+count+'|'+count+'(?: (?:части|частей|часть))?(?: —)? (?:потому что )?закрашен[оыа]?)'));
  const whole=c.match(new RegExp('^(?:(?:снизу|внизу|знаменатель)\\s*[:—-]?\\s*)?(?:всего '+count+'|'+count+'(?: равных)? (?:частей|части|часть) всего|'+count+'(?: —)? (?:потому что )?всего|(?:целое|полоску|ленту) разделили на '+count+' равных)'));
  const hasExtraNumber=match=>new RegExp('(?:^|\\s)'+qty+'(?:\\s|$)').test(c.slice(match[0].length).trim());
  if(marked){if(hasExtraNumber(marked))return false;top.add(read(marked[1]??marked[2]));}
  if(whole){if(hasExtraNumber(whole))return false;bottom.add(read(whole.slice(1).find(Boolean)));}
  if(!marked&&!whole&&new RegExp('(?:^|\\s)'+qty+'(?:\\s|$)').test(c))return false;
 }
 return top.size===1&&top.has(n)&&bottom.size===1&&bottom.has(d);
}
function combined(raw){
 const split=raw.match(/^(.+?)\s*(?:[,;]|\s+потому что\s+)\s*(.+)$/i);
 if(!split)return null;
 const answer=fraction(split[1]);
 return answer?{answer,reason:split[2]}:null;
}
function uncertainty(raw){
 return forgotten(raw)||/^(?:не получается|помоги|подсказка|я угадал[а]?|угадал[а]?|наугад)[.!?]*$/i.test(raw.trim());
}
function forgotten(raw){
 const text=raw.toLowerCase().replace(/ё/g,'е').replace(/[.,!?;:—–…]/g,' ').replace(/\s+/g,' ').trim();
 if(/(?:^| )(?:не то чтобы|не скажу что|не говорю что|это не значит что)(?: |$)/.test(text))return false;
 if(/(?:^| )(?:теперь|уже) (?:я )?(?:понял[а]?|понимаю)(?: |$)/.test(text))return false;
 return /(?:^| )(?:не (?:пойму|понял[а]?|понимаю|знаю|помню|разобрал(?:ся|ась)|могу (?:понять|разобраться|решить))|непонятно|не получается|запутал(?:ся|ась)|забыл[а]?)(?: |$)/.test(text)
  || /^(?:(?:ой|блин|ну|я|мне|это|очень|слишком|пока|правда) )*(?:сложно|трудно|тяжело)(?: |$)/.test(text);
}
function explainParts(n,d){return `Давай вспомним. Нижнее число, ${d}, показывает, на сколько равных частей разделили целое. Верхнее число, ${n}, показывает, сколько частей закрасили.`;}
function selfCorrection(raw){
 const parts=raw.split(/(?:[,.!?;—–]\s*|\s+)(?:ой[,\s]+нет|нет[,\s]+(?:вернее|это|правильнее|все-таки)|я поправлюсь|поправлюсь|точнее|вернее)[.,!:—–\s]+/i);
 if(parts.length<2)return raw;
 const final=parts.at(-1).trim();
 return fraction(final)||combined(final)?final:raw;
}
function mathQuestion(raw){
 const text=normalize(raw);
 if(!/^(?:а\s+)?(?:что |почему |зачем |как |объясни(?:\s|$)|можешь объяснить)/i.test(text)&&!text.endsWith('?'))return null;
 if(/^что такое цел(?:ые|ый)[?.!]*$/.test(text))return 'Если ты про целое на рисунке, это вся фигура, в том числе незакрашенная часть.';
 if(/целое|вся полоска|вся лента/.test(text))return 'Целое здесь — вся фигура, в том числе незакрашенная часть.';
 if(/равн.*част|част.*равн|поровну/.test(text))return 'Равные части — части одинакового размера. У полоски это отрезки одинаковой длины.';
 if(/знаменател|нижн.*числ|числ.*внизу|внизу/.test(text))return 'Нижнее число показывает, на сколько равных частей разделили целое.';
 if(/числител|верхн.*числ|числ.*сверху|сверху/.test(text))return 'Верхнее число показывает, сколько равных частей взяли. Здесь — сколько закрасили.';
 if(/означает дробь|что такое дробь/.test(text))return 'Дробь показывает, какую долю целого взяли. В этой задаче — какую часть фигуры закрасили.';
 return null;
}
export function firstLesson(){
 let index=0,phase='answer',hint=false,assisted=false,done=false,unclear=0;
 let guard=createTutor({equal:true,total:5,marked:2});
 const notes=[];
 const snapshot=()=>({done,notes:notes.map(x=>({...x}))});
 const end=()=>{done=true;return guard.end();};
 function advance(correct,understanding){
  notes.push({correct,understanding,independent:correct&&understanding&&!assisted});
  if(index===1){
   done=true;
   return notes[1].independent
    ? 'Ты самостоятельно решил новый пример и объяснил оба числа.'
    : 'На новом примере самостоятельное понимание пока не подтверждено.';
  }
  index++;phase='answer';hint=false;assisted=false;unclear=0;
  guard=createTutor({equal:true,total:6,marked:3});
  return 'Теперь новый пример — попробуй самостоятельно. '+items[index].title+' Какая доля закрашена?';
 }
 return {opening:items[0].title+' Какая доля закрашена?',snapshot,end,
  expectsFraction:()=>phase==='answer',markHelp:()=>{assisted=true;},example:()=>({...items[index],number:index+1}),
  resumeQuestion:()=>phase==='reason'?why:items[index].title+' Какая доля закрашена?',async send(raw){
  if(done)return labels.ended;
  const decision=await guard.send(raw);
  if(decision===labels.stop){done=true;return decision;}
  if(decision===labels.offer)return decision;
  if(decision===labels.declined)return decision+' '+this.resumeQuestion();
  if(decision!==labels.wait){
   assisted=true;
   phase='reason';return decision+' '+why;
  }
  const {n,d}=items[index];
  if(/(?:размер|равенство|величина).{0,32}(?:безразлич|неваж|не важ|не имеет значения)|(?:неважно|не важно).{0,24}(?:равны|одинаков)/i.test(raw)){
   assisted=true;return 'Размер важен: считать части можно, когда они равные. Что показывают оба числа именно на этой полоске?';
  }
  if(forgotten(raw)){assisted=true;phase='reason';return explainParts(n,d)+' '+why;}
  const questionHelp=mathQuestion(raw);
  if(questionHelp){
   guard.dismissOffer();assisted=true;
   return questionHelp+' '+(phase==='reason'?'Вернёмся к твоей записи. '+why:'Вернёмся к рисунку. Какая доля закрашена?');
  }
  raw=selfCorrection(raw);
  const joint=combined(raw);
  const f=joint?.answer??fraction(raw);
  if(f||evidence(raw,n,d)||uncertainty(raw))guard.dismissOffer();
  if(phase==='reason'){
   if(f&&!(f[1]>0&&f[0]*d===n*f[1]))
    return 'Давай сверим твою поправку с рисунком. Сколько равных частей всего и сколько закрашено?';
   if(f&&f[1]>0&&f[0]*d===n*f[1]&&!joint)return 'Дробь уже верная. '+why;
   if(joint&&joint.answer[0]===n&&joint.answer[1]===d&&evidence(joint.reason,n,d))
    return 'Отлично, оба числа объяснены верно! '+advance(true,true);
   if(evidence(raw,n,d))return 'Молодец! Ты объяснил, сколько частей закрашено и сколько равных частей всего. '+advance(true,true);
   if(forgotten(raw)){assisted=true;return explainParts(n,d)+' '+advance(true,false);}
   if(!hint){
    hint=true;assisted=true;
    return 'Верхнее число связано с закрашенными частями, нижнее — со всеми равными частями. Объясни, что показывает каждое число в твоей дроби.';
   }
   return explainParts(n,d)+' '+advance(true,false);
  }
  if(!f&&evidence(raw,n,d))return 'Верно: ты объяснил, сколько частей закрашено и сколько равных частей всего. '+advance(true,true);
  if(f&&f[1]>0&&f[0]*d===n*f[1]){
   if(f[0]!==n||f[1]!==d)return 'Это та же доля. Как записать её по числу закрашенных и всех равных частей на этом рисунке?';
   if(joint&&evidence(joint.reason,n,d))return 'Дробь верная, и ты объяснил оба числа. '+advance(true,true);
   phase='reason';
   return 'Да, молодец! Дробь верная. '+why;
  }
  if(!f&&!uncertainty(raw)){
   if(++unclear===1)return 'Давай попробуем ещё раз. Скажи дробь словами или напиши её цифрами.';
   assisted=true;
   return 'Разберём этот пример вместе. '+explainParts(n,d)+' Значит, закрашено '+n+'/'+d+'. '+advance(false,false);
  }
  if(forgotten(raw)){
   assisted=true;
   return 'Разберём этот пример вместе. '+explainParts(n,d)+' Значит, закрашено '+n+'/'+d+'. '+advance(false,false);
  }
  if(!hint){
   hint=true;assisted=true;
   if(f&&f[1]===n&&f[0]===d)return 'Давай попробуем ещё раз. Начни с целого: внизу пишем, на сколько равных частей его разделили.';
   return 'Давай попробуем ещё раз. Начни с целого: посчитай все равные части, а потом закрашенные. Какую дробь получишь?';
  }
  return 'Разберём этот пример вместе. '+explainParts(n,d)+' Значит, закрашено '+n+'/'+d+'. '+advance(false,false);
 }};
}

const equalTrack=[
 {title:'Полоска: три части разной длины. Одна закрашена.',widths:[1,2,3],n:1,d:3,equal:false},
 {title:'Лента: один из трёх равных отрезков закрашен.',widths:[1,1,1],n:1,d:3,equal:true}
];
const negative=/^(?:нет|нельзя|не обязательно|не треть|по одному числу частей нельзя)(?:[\s,.!]|$)/i;
const unequalParts=/(?:части|куски|кусочки|отрезки)\s+(?:(?:все|здесь|уже)\s+)?(?:неравные|не равны|не одинаковы|неодинаковые|разной длины|разного размера)|(?:длина|длины|размер|размеры)\s+(?:частей|кусков|кусочков|отрезков)\s+(?:разн\w*|не равны|не одинаковы)/i;
export function secondLesson(){
 let index=0,phase='answer',help=false,done=false;
 const notes=[];
 let guard=createTutor({equal:false,total:3,marked:1});
 const question=()=>index===0?'Можно ли назвать закрашенное одной третью просто потому, что это одна часть из трёх?':'Какая доля ленты закрашена?';
 function finish(correct,understanding){
  notes.push({correct,understanding,independent:correct&&understanding&&!help});
  if(index===1){
   done=true;
   return notes[1].independent?'Ты самостоятельно объяснил, когда долю можно определить по числу частей.':'Самостоятельное объяснение на новом примере пока не подтверждено.';
  }
  index++;phase='answer';help=false;
  guard=createTutor({equal:true,total:3,marked:1});
  return 'Теперь попробуй самостоятельно. '+equalTrack[1].title+' '+question();
 }
 function explain(){
  return index===0?'По одному количеству частей долю не определить: части разной длины. Для доли нужно сравнить длину закрашенного отрезка с длиной всей полоски.':
   'Ленту разделили на три равных отрезка. Закрашен один из них — это одна треть.';
 }
 return {
  opening:equalTrack[0].title+' '+question(),
  markHelp:()=>{help=true;},resumeQuestion:()=>phase==='reason'?(index===0?'Почему здесь нельзя просто посчитать части?':'Почему здесь можно определить долю по числу частей?'):question(),
  example:()=>({...equalTrack[index],number:index+1}),
  snapshot:()=>({done,notes:notes.map(x=>({...x}))}),
  end(){done=true;return guard.end();},
  async send(raw){
   if(done)return labels.ended;
   const signal=await guard.send(raw);
   if(signal===labels.stop){done=true;return signal;}
   if(signal===labels.offer)return signal;
   if(signal===labels.declined)return signal+' '+this.resumeQuestion();
   if(signal!==labels.wait||forgotten(raw)){help=true;phase='reason';return explain()+' '+this.resumeQuestion();}
   const text=normalize(raw), no=negative.test(text), unequal=unequalParts.test(text);
   const answer=fraction(raw)??combined(raw)?.answer;
   const correctFraction=answer&&answer[0]>0&&answer[1]===3*answer[0];
   const reasoning=combined(raw)?.reason??raw;
   const equalReason=!unequal&&/равн|одинаков/.test(reasoning)&&(evidence(reasoning,1,3)||
    /^один из (?:трех|3) равных (?:отрезков|частей) закрашен[.!]?$/i.test(normalize(reasoning)));
   if(no||answer||uncertainty(raw)||equalReason)guard.dismissOffer();
   const claimsThird=/^(?:да|можно|это треть|это одна треть)(?:[\s,.!]|$)/i.test(text)||!!answer;
   if(index===0&&!claimsThird&&(no||phase==='reason'||/нельзя|недостаточно/.test(text))&&unequal)
    return 'Верно: число частей не показывает их длину. '+finish(true,true);
   if(index===0&&no&&phase==='answer'){
    phase='reason';return 'Ответ «нет» верный. Почему здесь нельзя просто посчитать части?';
   }
   if(index===1&&(!answer||correctFraction)&&equalReason)
    return 'Верно: одна из трёх равных частей — одна треть. '+finish(true,true);
   if(index===1&&correctFraction){
    phase='reason';return 'Одна треть — верно. Почему здесь можно определить долю по числу частей?';
   }
   if(!help){
    help=true;
    if(index===1&&answer&&!correctFraction&&equalReason)
     return 'Ты верно посчитал части, но записанная дробь им не соответствует. Как записать одну закрашенную часть из всех равных отрезков?';
    return index===0?'Сравни длины трёх частей. Можно ли считать их одинаковыми долями?':
     'Посмотри на рисунок: одинаковой ли длины отрезки? Объясни, как это помогает найти долю.';
   }
   return explain()+' '+finish(phase==='reason',false);
  }
 };
}

const equivalentTrack=[
 {title:'Полоска: две из четырёх равных частей закрашены.',n:2,d:4,base:'1/2',wholeGroups:2},
 {title:'Лента: две из шести равных частей закрашены.',n:2,d:6,base:'1/3',wholeGroups:3}
];
export function thirdLesson(){
 let index=0,phase='decision',help=false,done=false;
 let guard=createTutor({equal:true,total:4,marked:2});
 const notes=[];
 const question=()=>{const {d,base}=equivalentTrack[index];return `На этой же фигуре какую долю обозначают 2/${d} и ${base}: одинаковую или разную?`;};
 const opening=()=>equivalentTrack[index].title+' '+question();
 const askWhy='Как можно объединить маленькие части, чтобы это стало видно?';
 const explain=()=>{const {d,base,wholeGroups}=equivalentTrack[index];
  return `Объединим маленькие части по две. Из ${d} равных частей получим ${wholeGroups} равные группы, одна из них закрашена. Поэтому 2/${d} и ${base} показывают одинаковую долю.`;};
 function advance(correct,understanding){
  notes.push({correct,understanding,independent:correct&&understanding&&!help});
  if(index===1){
   done=true;
   return notes[1].independent?'Ты самостоятельно объяснил, почему разные дроби могут обозначать одну и ту же долю.':'На новом примере самостоятельное объяснение пока не подтверждено.';
  }
  index=1;phase='decision';help=false;guard=createTutor({equal:true,total:6,marked:2});
  return 'Теперь попробуй самостоятельно. '+opening();
 }
 return {
  markHelp:()=>{help=true;},opening:opening(),example:()=>({...equivalentTrack[index],number:index+1}),
  resumeQuestion:()=>phase==='reason'?'Почему эти дроби обозначают одну и ту же долю?':question(),
  snapshot:()=>({done,notes:notes.map(x=>({...x}))}),
  end(){done=true;return guard.end();},
  async send(raw){
   if(done)return labels.ended;
   const signal=await guard.send(raw);
   if(signal===labels.stop){done=true;return signal;}
   if(signal===labels.offer)return signal;
   if(signal===labels.declined)return signal+' '+this.resumeQuestion();
   if(signal!==labels.wait||forgotten(raw)){help=true;phase='reason';return explain()+' '+askWhy;}
   const text=normalize(raw).replace(/[.!?]+$/,'');
   const same=/^(?:да|одинаковую|одинаковые|одна и та же доля|равны|это одно и то же)(?:$|[,;])/.test(text);
   const different=/^(?:нет|разную|разные|не равны)(?:$|[,;])/.test(text);
   const group=index===0?'(?:две|2)':'(?:три|3)';
   const reason=new RegExp('^(?:если )?(?:сгруппировать|объединить|группируем|объединяем|соединим|собрать) (?:части |их )?по (?:две|два|2)(?: (?:кусочка|части))?[,;]?(?: получим| получится)? '+group+' равные группы[,;] (?:закрашена одна|одна закрашена)(?: группа)?$');
   const reasoning=text.replace(/^(?:да|одинаковую|равны)[,;]\s*/,'');
   const {d,base}=equivalentTrack[index];
   const dividesBoth=new RegExp('^(?:если )?разделить (?:верхнее и нижнее числа|оба числа|числитель и знаменатель) на (?:два|2), из 2/'+d+' получится '+base+'$');
   const paired=new RegExp('^(?:мы )?объединили '+(index===0?'(?:четыре|4)':'(?:шесть|6)')+' равных (?:кусочка|части|частей|кусочков) попарно[:,] получились '+group+' одинаковые группы,? и закрашена (?:ровно )?одна$');
   const understood=!different&&(reason.test(reasoning)||paired.test(reasoning)||dividesBoth.test(reasoning));
   if(same||different||understood||uncertainty(raw))guard.dismissOffer();
   if(understood)return 'Верно: изменилось деление на части, а закрашенная доля не изменилась. '+advance(true,true);
   if(same){phase='reason';return 'Да, доля одна и та же. '+askWhy;}
   if(!help){
    help=true;
    return 'Попробуй объединить маленькие части по две. Сколько равных групп получится и сколько из них закрашено?';
   }
   return explain()+' '+advance(phase==='reason',false);
  }
 };
}
