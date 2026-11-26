import test from 'node:test';
import assert from 'node:assert/strict';
import {firstLesson,secondLesson,thirdLesson,voiceTurn} from '../frontend/public/sedum/anna/tutor-lesson.mjs';
for(const [make,first,second,third] of [
 [firstLesson,'две закрашены, всего пять','три закрашены, всего шесть','одна закрашена, всего четыре'],
 [secondLesson,'нельзя, части разной длины','один из трех равных отрезков закрашен','один из четырех равных отрезков закрашен'],
 [thirdLesson,...[4,6,8].map(d=>'разделить оба числа на два, из 2/'+d+' получится 1/'+d/2)]
]){
 test(make.name+' — после помощи новый пример, без ложного зачёта',async()=>{
  for(const helpAgain of [false,true]){
   const t=make();await t.send(first);const old=t.example();t.markHelp();await t.send(second);
   assert.equal(t.snapshot().done,false);assert.equal(t.snapshot().notes[1].independent,false);
   assert.equal(t.example().number,3);assert.notEqual(t.example().d,old.d);
   if(helpAgain)t.markHelp();await t.send(third);assert.equal(t.snapshot().done,true);
   assert.equal(t.snapshot().notes.at(-1).independent,!helpAgain);
  }
  const t=make();await t.send(first);await t.send(second);assert.equal(t.snapshot().done,true);assert.equal(t.snapshot().notes.length,2);
 });
}
test('ASR: исправление доли, но не догадка по знаку минус',async()=>{
 const heard=s=>({local:true,transcript:s,isFinal:true,confidence:.82});
 for(const s of ['3-5. Ой, нет, 2-5.','3/5. Ой, нет, 2/5.','Три-пятых. Ой, нет. Две-пятых.']){
  const t=firstLesson(),r=await voiceTurn(t,heard(s));assert.match(r.teacher,/Дробь верная/);assert.equal(r.student,s);
 }
 for(const s of ['2-5','2 − 5','три минус пять','3-6. Ой, нет, 2-5.','3-5. Ой, нет, 2 минус 5.']){
  const t=firstLesson();assert.match((await voiceTurn(t,heard(s))).teacher,/вычитаешь/);assert.equal(t.expectsFraction(),true);assert.deepEqual(t.snapshot().notes,[]);
 }
 assert.doesNotMatch(await firstLesson().send('3-5. Ой, нет, 2-5.'),/Дробь верная/);
 assert.doesNotMatch((await voiceTurn(firstLesson(),heard('2-5. Ой, нет, 3-5.'))).teacher,/Дробь верная/);
});

for(const factory of [firstLesson,secondLesson,thirdLesson]){
 test(factory.name+' — помощь и отказ остаются на задаче',async()=>{
  for(const response of ['да, помоги','нет, попробую сам','не помню']){
   const lesson=factory();
   if(response!=='не помню')assert.match(await lesson.send('дай ответ'),/вместе/);
   assert.match(await lesson.send(response),/\?/);
   assert.deepEqual(lesson.snapshot(),{done:false,notes:[]});
   assert.equal(lesson.example().number,1);
   assert.match(await lesson.send('закончить урок'),/закончим/);
  }
 });
}
test('пересказ, противоречие и показ решения не смешиваются',async()=>{
 const lesson=firstLesson();
 await lesson.send('две пятых');
 await lesson.send('Пять — это все равные кусочки, а два мы закрасили.');
 assert.equal(lesson.snapshot().notes[0].independent,true);
 await lesson.send('три закрашены, всего шесть, размер частей вообще безразличен');
 assert.equal(lesson.snapshot().notes.length,1);
 const afterBoard=firstLesson();afterBoard.markHelp();
 await afterBoard.send('две закрашены, всего пять');
 assert.equal(afterBoard.snapshot().notes[0].independent,false);
});
test('группировка четвертей своими словами',async()=>{
 const lesson=thirdLesson();await lesson.send('да');
 await lesson.send('Мы объединили четыре равных кусочка попарно: получились две одинаковые группы, и закрашена ровно одна.');
 assert.equal(lesson.snapshot().notes[0].independent,true);
});
