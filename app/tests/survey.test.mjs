import {test} from 'node:test';
import assert from 'node:assert/strict';
import {questions,validate} from '../lib/survey.mjs';
function valid(){return Object.fromEntries(questions.map(q=>[q.id,q.type==='number'?22:q.type?'Пример':q.multi?[q.options[0]]:q.options[0]]));}
test('complete survey and optional name',()=>{const a=valid();delete a.name;assert.deepEqual(validate(a).errors,{});assert.equal(validate(a).state,'completed');});
test('exclusive choices rejected',()=>{for(const id of ['directions','difficulties']){const q=questions.find(q=>q.id===id);for(const i of q.exclusive){const a=valid();a[id]=[q.options[0],q.options[i]];assert.ok(validate(a).errors[id]);}}});
test('all hidden values excluded on server',()=>{const a=valid();a.city='Алматы';for(const id of ['directions','goal','difficulties'])a[id+'Other']='Старый ответ';const r=validate(a);assert.deepEqual(r.errors,{});for(const id of ['city','directionsOther','goalOther','difficultiesOther'])assert.equal(r.data[id],undefined);});
test('conditional fields required',()=>{const a=valid();a.format='Любой.';assert.ok(validate(a).errors.city);a.city='Алматы';const q=questions.find(q=>q.id==='directions');a.directions=[q.options[7]];assert.ok(validate(a).errors.directionsOther);a.directionsOther='Образование';assert.deepEqual(validate(a).errors,{});});
test('excluded participant retains only first three answers',()=>{const a=valid();a.status=questions[2].options[2];const r=validate(a);assert.equal(r.state,'excluded');assert.deepEqual(Object.keys(r.data),['name','age','status']);assert.deepEqual(r.errors,{});});
test('trim, length and numeric constraints',()=>{const a=valid();a.name='  Анна  ';assert.equal(validate(a).data.name,'Анна');a.skills='   ';assert.ok(validate(a).errors.skills);a.skills='a'.repeat(2001);assert.ok(validate(a).errors.skills);a.age=22.5;assert.ok(validate(a).errors.age);a.age=121;assert.ok(validate(a).errors.age);});
test('unknown and duplicate choices rejected',()=>{const a=valid();a.directions=['IT и аналитика.','IT и аналитика.'];assert.ok(validate(a).errors.directions);a.status='admin';assert.ok(validate(a).errors.status);});
