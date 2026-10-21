import Link from 'next/link';import {supabaseServer} from '@/lib/supabase/server';
export default async function Nav(){const {data:{user}}=await supabaseServer().auth.getUser();return(
<header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur"><nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3"><Link href="/" className="text-xl font-extrabold">Stay<span className="text-teal">Finder</span></Link>
<div className="flex items-center gap-5 text-sm font-medium"><Link href="/explore">Explore</Link>{user?<><Link href="/dashboard">Dashboard</Link><form action="/api/logout" method="post"><button className="text-gray-500">Logout</button></form></>:<Link href="/login" className="btn !py-2">Sign in</Link>}</div></nav></header>)}
