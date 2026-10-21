'use client';import {useState} from 'react';import {supabaseBrowser} from '@/lib/supabase/client';
export default function Login(){const [mode,setMode]=useState<'in'|'up'>('in');const [err,setErr]=useState('');const [msg,setMsg]=useState('');
async function go(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setErr('');setMsg('');const f=new FormData(e.currentTarget);const email=String(f.get('email')),password=String(f.get('password'));
if(password.length<8)return setErr('Password must be at least 8 characters.');const sb=supabaseBrowser();
if(mode==='up'){const {data,error}=await sb.auth.signUp({email,password,options:{data:{full_name:String(f.get('name'))}}});if(error)return setErr(error.message);if(!data.session)return setMsg('Check your email to confirm your account.')}
else{const {error}=await sb.auth.signInWithPassword({email,password});if(error)return setErr(error.message)}
location.href='/dashboard'}
return <form onSubmit={go} className="card mx-auto my-16 max-w-md space-y-4 p-8"><h1 className="text-2xl font-bold">{mode==='in'?'Welcome back':'Create your account'}</h1>
{mode==='up'&&<input name="name" required placeholder="Full name" aria-label="Full name" className="input"/>}
<input name="email" type="email" required placeholder="Email" aria-label="Email" className="input"/><input name="password" type="password" required placeholder="Password (8+ chars)" aria-label="Password" className="input"/>
{err&&<p role="alert" className="text-sm text-red-600">{err}</p>}{msg&&<p className="text-sm text-teal">{msg}</p>}
<button className="btn w-full">{mode==='in'?'Sign in':'Sign up'}</button><button type="button" className="text-sm underline" onClick={()=>setMode(mode==='in'?'up':'in')}>{mode==='in'?'Need an account? Sign up':'Have an account? Sign in'}</button></form>}
