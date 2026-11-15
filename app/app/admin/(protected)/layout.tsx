import { isAdmin } from '../../../lib/admin';
import { redirect } from 'next/navigation';
import { chatGPTSignOutPath } from '../../chatgpt-auth';
export const dynamic='force-dynamic';
export default async function AdminLayout({children}:{children:React.ReactNode}){
 if(!await isAdmin())redirect('/admin/login');
 return <div className="admin"><aside><a className="brand" href="/admin/responses">↗ Точка старта</a><span className="eyebrow">ИССЛЕДОВАНИЕ СТАЖИРОВОК</span><nav><a href="/admin/responses">▤ Ответы участников</a><a href="/admin/statistics">▥ Статистика</a><a href="/survey">↗ Открыть опрос</a></nav><div className="asideBottom"><span className="badge">Учебный проект</span><a target="_top" href={chatGPTSignOutPath('/admin/login')}>Выйти из кабинета</a></div></aside><main className="adminMain">{children}</main></div>
}
