export const questions = [
 {id:'name',title:'Как вас зовут?',type:'text',optional:true,max:200},
 {id:'age',title:'Сколько вам полных лет?',type:'number'},
 {id:'status',title:'Какой у вас сейчас статус?',options:['Студент(ка) вуза.','Выпускник(ца) вуза.','Не учусь в вузе и не имею высшего образования.']},
 {id:'specialty',title:'По какой специальности вы учитесь или окончили вуз?',type:'text',max:500},
 {id:'directions',title:'В каких профессиональных направлениях вы хотели бы пройти стажировку?',multi:true,exclusive:[8],options:['IT и аналитика.','Маркетинг и реклама.','Финансы и экономика.','Инженерия и производство.','Управление и HR.','Дизайн и медиа.','Наука и исследования.','Другое — укажите.','Пока не определился(-ась).']},
 {id:'experience',title:'Есть ли у вас опыт в интересующем направлении?',options:['Нет опыта.','Есть учебные или личные проекты.','Проходил(а) стажировку, но ещё не работал(а) в этой сфере.','Есть опыт работы.']},
 {id:'skills',title:'Какие навыки вы уже можете применить на стажировке?',type:'textarea',max:2000,hint:'Например: иностранные языки, Excel, программирование, дизайн, работа с текстами, проведение исследований.'},
 {id:'goal',title:'Какова ваша основная цель прохождения стажировки?',options:['Попробовать профессию.','Получить практический опыт.','Пройти учебную практику.','Найти постоянную работу.','Получить доход.','Другое — укажите.']},
 {id:'format',title:'Какой формат стажировки вам подходит?',options:['Удалённый.','Очный.','Гибридный.','Любой.']},
 {id:'hours',title:'Сколько времени в неделю вы готовы уделять стажировке?',options:['Менее 10 часов.','От 10 до 20 часов.','От 21 до 30 часов.','Более 30 часов.']},
 {id:'pay',title:'Насколько для вас важна оплата стажировки?',options:['Рассматриваю только оплачиваемые стажировки.','Предпочитаю оплачиваемые, но готов(а) рассмотреть другие варианты.','Оплата не обязательна, если стажировка даёт полезный опыт.']},
 {id:'difficulties',title:'С какими трудностями вы сталкиваетесь при поиске стажировки?',multi:true,exclusive:[6,7],options:['Не знаю, где искать.','Не понимаю, какое направление выбрать.','Не хватает опыта или навыков.','Сложно совмещать с учёбой или работой.','Мало подходящих предложений.','Не получаю ответов на отклики.','Пока не искал(а) стажировку.','Трудностей нет.','Другое — укажите.']}
];
export const excludedMessage='Спасибо за интерес к проекту! Этот опрос предназначен для студентов и выпускников вузов.';
export const successMessage='Спасибо за участие! Ваши ответы помогут нам разработать проект по подбору стажировок для студентов и выпускников.';
export function hasOther(q,value){return q.multi ? Array.isArray(value)&&value.some(v=>v===q.options.find(o=>o.startsWith('Другое'))) : typeof value==='string'&&value.startsWith('Другое');}
export function validate(input){
 const errors={},data={};
 if(!input||typeof input!=='object'||Array.isArray(input))return {errors:{form:'Некорректная анкета'},data,state:'completed'};
 const excluded=input.status===questions[2].options[2];
 function text(id,max,optional=false){const v=typeof input[id]==='string'?input[id].trim():'';if(!v&&!optional)errors[id]='Заполните поле';if([...v].length>max)errors[id]=`Не более ${max} символов`;data[id]=v;}
 for(const q of excluded?questions.slice(0,3):questions){
  if(q.type==='number'){const v=input[q.id];if(!/^[0-9]{1,3}$/.test(String(v??''))||Number(v)<1||Number(v)>120)errors[q.id]='Введите целый возраст от 1 до 120';else data[q.id]=Number(v);}
  else if(q.type)text(q.id,q.max,!!q.optional);
  else if(q.multi){const v=input[q.id];if(!Array.isArray(v)||!v.length||v.some(x=>!q.options.includes(x))||new Set(v).size!==v.length)errors[q.id]='Выберите допустимые варианты';else if(v.length>1&&q.exclusive?.some(i=>v.includes(q.options[i])))errors[q.id]='Эти варианты нельзя сочетать';else data[q.id]=v;}
  else {if(!q.options.includes(input[q.id]))errors[q.id]='Выберите один вариант';else data[q.id]=input[q.id];}
  if(q.options&&hasOther(q,data[q.id]))text(q.id+'Other',2000);
  if(q.id==='format'&&data.format&&data.format!==q.options[0])text('city',200);
 }
 return {errors,data,state:excluded?'excluded':'completed'};
}
