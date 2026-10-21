import {notFound} from 'next/navigation';import {supabaseServer} from '@/lib/supabase/server';import BookingPanel from '@/components/BookingPanel';import PropertyCard from '@/components/PropertyCard';import type {Property} from '@/lib/types';
export const dynamic='force-dynamic';
export default async function P({params}:{params:{id:string}}){const sb=supabaseServer();
const {data:p}=await sb.from('properties').select('*').eq('id',params.id).single<Property>();if(!p)notFound();
const {data:sim}=await sb.from('properties').select('*').neq('id',p.id).eq('category',p.category).limit(3);
return <div className="mx-auto max-w-6xl px-4 py-8"><div className="grid gap-2 overflow-hidden rounded-2xl sm:grid-cols-2">{p.images.slice(0,2).map((i,k)=><img key={k} src={i} alt={`${p.title} photo ${k+1}`} className="h-72 w-full object-cover"/>)}</div>
<div className="mt-8 grid gap-10 lg:grid-cols-3"><div className="lg:col-span-2"><h1 className="text-3xl font-bold">{p.title}</h1><p className="text-gray-500">{p.city}, {p.country} · ★ {p.rating} ({p.review_count} reviews)</p>
<p className="mt-2 text-sm">Up to {p.capacity} guests · {p.property_type} · Check-in 2:00 PM · Check-out 11:00 AM</p><p className="mt-6">{p.description}</p>
<h2 className="mt-8 text-xl font-semibold">Amenities</h2><ul className="mt-3 flex flex-wrap gap-2">{p.amenities.map(a=><li key={a} className="rounded-full bg-soft px-4 py-1 text-sm">{a}</li>)}</ul></div>
<BookingPanel id={p.id} price={p.price_per_night} capacity={p.capacity}/></div>
{!!sim?.length&&<><h2 className="mb-4 mt-12 text-xl font-semibold">Similar stays</h2><div className="grid gap-6 sm:grid-cols-3">{(sim as Property[]).map(s=><PropertyCard key={s.id} p={s} fav={false}/>)}</div></>}</div>}
