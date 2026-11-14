import { chatGPTSignInPath,chatGPTSignOutPath,getChatGPTUser } from '../../chatgpt-auth';
import { isAdmin } from '../../../lib/admin';
import { redirect } from 'next/navigation';
export const dynamic='force-dynamic';
export default async function Login(){
 if(await isAdmin())redirect('/admin/responses');
 const user=await getChatGPTUser();
 return <main className="login"><a className="brand" href="/survey">↗ Точка старта</a><section className="card"><span className="eyebrow">КАБИНЕТ ИССЛЕДОВАТЕЛЯ</span><h1>Ответы становятся<br/>выводами.</h1><p>Войдите, чтобы просматривать анкеты и статистику исследования.</p>{user?<><p role="alert">Для аккаунта {user.email} доступ не предоставлен. Обратитесь к администратору проекта.</p><a className="button" target="_top" href={chatGPTSignOutPath('/admin/login')}>Выйти из аккаунта</a></>:<a className="button" target="_top" href={chatGPTSignInPath('/admin/responses')}>Войти через ChatGPT ↗</a>}<p className="muted">Доступ предоставляется только администратору.</p></section><a href="/survey">← Вернуться к опросу</a></main>
}
