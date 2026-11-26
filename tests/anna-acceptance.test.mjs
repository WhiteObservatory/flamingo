import test from 'node:test';
import assert from 'node:assert/strict';
import {firstLesson,secondLesson,thirdLesson} from '../frontend/public/sedum/anna/tutor-lesson.mjs';

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
