export const labels={
 stop:'Хорошо, на сегодня закончим.',ended:'Урок уже завершён.',
 offer:'Давай разберём этот пример вместе?',declined:'Хорошо, пока не разбираем.',
 wait:'Можем сделать паузу. Чтобы завершить урок, нажми «Закончить урок».'
};
const norm=s=>s.toLowerCase().replaceAll('ё','е').replace(/[^\p{L}\p{N} ]/gu,' ').replace(/\s+/g,' ').trim();
export function checkData(t){
 const valid=(n,d)=>Number.isFinite(n)&&Number.isFinite(d)&&d>0&&n>=0&&n<=d;
 if(t.measure&&valid(t.measure.marked,t.measure.whole)&&t.measure.unit)return {n:t.measure.marked,d:t.measure.whole,unit:t.measure.unit};
 if(t.equal===true&&Number.isInteger(t.total)&&Number.isInteger(t.marked)&&valid(t.marked,t.total))return {n:t.marked,d:t.total};
 if(t.equal===false)return {text:'По числу частей долю не узнать: части неравные. Нужно знать размер закрашенной части и всего целого.'};
 return {text:'Эти части одинаковы по размеру? Без этого нельзя определить долю по их количеству.'};
}
export function createTutor(task){
 let state='active';
 const end=()=>{state='ended';return labels.stop;};
 return {end,dismissOffer(){if(state==='offered')state='active';},async send(raw){
  if(state==='ended')return labels.ended;
  const s=norm(raw);
  if(/^(стоп|на этом остановимся|все заканчиваем|мне пора закончим позже|я больше не хочу заниматься|хватит на сегодня|давай(?:те)? закончим(?: урок)?|(?:я устал[а]? )?(?:я )?(?:больше )?не хочу продолжать(?: урок)?|на сегодня все|можно закончить|закончим на сегодня)$/.test(s))return end();
  if(/^(?:(?:пожалуйста )?(?:просто )?(?:скажи(?:те)?|дай(?:те)?|назови(?:те)?) (?:мне )?(?:готовый )?(?:ответ|результат)(?: пожалуйста)?|(?:а )?какой (?:тут )?(?:правильный )?ответ|какой будет ответ|можешь сказать что получилось)$/.test(s)){state='offered';return labels.offer;}
  if(state==='offered'&&/^(нет|не надо|не сейчас спасибо|не хочу разбирать)$/.test(s)){state='active';return labels.declined;}
  if(state==='offered'&&/^(да|да давай разберем|давай(?:те)? разберем(?: пример)?|согласен|согласна|хочу разобрать|покажи решение|хорошо объясни|ага давай|да покажи как)$/.test(s)){
   state='active';
   const data=checkData(task);
   if(data.text)return data.text;
   const fact=data.unit?`Закрасили ${data.n} ${data.unit} из ${data.d} ${data.unit}.`:`Целое разделили на ${data.d} равных частей. Из них закрасили ${data.n}.`;
   const equivalent=data.unit&&data.n*2===data.d?' Это половина.':'';
   return `${fact} Закрашенная доля — ${data.n}/${data.d}.${equivalent}`;
  }
  return labels.wait;
 }};
}
export const tasks=[
 {title:'Две из пяти неравных частей полоски, длины неизвестны',equal:false,total:5,marked:2},
 {title:'Лента: закрашены 5 см из 10 см',equal:false,total:3,marked:1,measure:{marked:5,whole:10,unit:'см'}},
 {title:'Круг: три из четырёх частей, равенство неизвестно',total:4,marked:3},
 {title:'Полоска: одна из двух частей, размеры неизвестны',total:2,marked:1},
 {title:'Круг: три из четырёх равных частей',equal:true,total:4,marked:3}
];
