import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Точка старта — стажировки',description:'Учебный опрос для студентов и выпускников вузов'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="ru"><body>{children}</body></html>}
