import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../app/chatgpt-auth';
export async function isAdmin(){
 const user=await getChatGPTUser();
 const allowed=String((env as unknown as Record<string,string>).ADMIN_EMAILS||'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
 return !!user&&allowed.includes(user.email.toLowerCase());
}
