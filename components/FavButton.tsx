'use client';import {useState} from 'react';
export default function FavButton({id,initial}:{id:string;initial:boolean}){const [on,setOn]=useState(initial);
async function t(e:React.MouseEvent){e.preventDefault();const r=await fetch('/api/favorites',{method:'POST',body:JSON.stringify({propertyId:id})});if(r.status===401)return (location.href='/login');if(r.ok)setOn((await r.json()).favorited)}
return <button onClick={t} aria-label={on?'Remove favorite':'Add favorite'} className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-lg shadow hover:scale-110 transition">{on?'❤️':'🤍'}</button>}
