import Link from 'next/link';import {supabaseServer} from '@/lib/supabase/server';import PropertyCard from '@/components/PropertyCard';import type {Property} from '@/lib/types';
export const dynamic='force-dynamic';
export default async function Home(){const sb=supabaseServer();const {data}=await sb.from('properties').select('*').order('rating',{ascending:false}).limit(6);
const {data:{user}}=await sb.auth.getUser();const favs=new Set(user?((await sb.from('favorites').select('property_id')).data||[]).map(f=>f.property_id):[]);
return <>
<section className="bg-gradient-to-br from-navy to-teal-dark px-4 py-24 text-center text-white"><h1 className="text-4xl font-extrabold md:text-6xl">Find Your Perfect Stay</h1><p className="mt-3 text-gray-200">Hotels, villas, apartments and homestays worldwide.</p>
<form action="/explore" className="mx-auto mt-10 grid max-w-4xl gap-3 rounded-2xl bg-white p-4 text-navy shadow-xl md:grid-cols-5">
<input name="q" placeholder="Where to?" aria-label="Destination" className="input md:col-span-2"/><input type="date" name="in" aria-label="Check-in" className="input"/><input type="date" name="out" aria-label="Check-out" className="input"/>
<input type="number" name="guests" min={1} placeholder="Guests" aria-label="Guests" className="input"/><button className="btn md:col-span-5">Search stays</button></form></section>
<section className="mx-auto max-w-6xl px-4 py-12"><h2 className="mb-4 text-2xl font-bold">Browse by category</h2><div className="flex flex-wrap gap-3">{['Beachfront','City Stays','Luxury','Nature','Budget'].map(c=><Link key={c} href={`/explore?category=${encodeURIComponent(c)}`} className="rounded-full bg-soft px-5 py-2 font-medium transition hover:bg-teal hover:text-white">{c}</Link>)}</div></section>
<section className="mx-auto max-w-6xl px-4 pb-16"><h2 className="mb-4 text-2xl font-bold">Popular stays</h2><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{(data as Property[]||[]).map(p=><PropertyCard key={p.id} p={p} fav={favs.has(p.id)}/>)}</div></section>
<section className="mx-auto mb-12 max-w-6xl rounded-2xl bg-orange-50 p-8"><h2 className="text-xl font-bold">Special offer</h2><p>Book 5+ nights on select stays and enjoy a better rate.</p></section></>}
