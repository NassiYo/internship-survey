import { env } from 'cloudflare:workers';
import { isAdmin } from '../../../lib/admin';
import { validate } from '../../../lib/survey.mjs';
export const dynamic='force-dynamic';
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(){
 if(!await isAdmin())return reply({error:'Нет доступа'},403);
 try {if(!env.DB)throw new Error("Database unavailable");const {results}=await env.DB.prepare('SELECT id, created_at, state, answers FROM responses ORDER BY created_at DESC').all();
 return reply({rows:results.map(r=>({...r,answers:JSON.parse(String(r.answers))}))});}
 catch{return reply({error:'Не удалось загрузить ответы. Повторите попытку.'},503);}
}
export async function POST(request:Request){
 const origin=request.headers.get('origin');
 if(origin&&origin!==new URL(request.url).origin)return reply({error:'Недопустимый источник запроса'},403);
 if(Number(request.headers.get('content-length')||0)>50000)return reply({error:'Слишком большой запрос'},413);
 let body;
 try{const raw=await request.text();if(raw.length>50000)return reply({error:'Слишком большой запрос'},413);body=JSON.parse(raw);}catch{return reply({error:'Некорректный запрос'},400);}
 if(!body||typeof body!=='object'||!/^([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i.test(body.id))return reply({error:'Некорректный идентификатор отправки'},400);
 const result=validate(body.answers);
 if(Object.keys(result.errors).length)return reply({errors:result.errors},400);
 try{if(!env.DB)throw new Error('Database unavailable');await env.DB.prepare('INSERT INTO responses (id, created_at, state, answers) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO NOTHING').bind(body.id,new Date().toISOString(),result.state,JSON.stringify(result.data)).run();return reply({ok:true,state:result.state});}
 catch{return reply({error:'Не удалось сохранить ответы. Ваши данные остались в форме. Попробуйте ещё раз.'},503);}
}

