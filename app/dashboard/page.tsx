import {redirect} from 'next/navigation';import {supabaseServer} from '@/lib/supabase/server';import CancelButton from '@/components/CancelButton';import PropertyCard from '@/components/PropertyCard';import type {Property} from '@/lib/types';
export const dynamic='force-dynamic';
export default async function D({searchParams}:{searchParams:{ref?:string}}){const sb=supabaseServer();const {data:{user}}=await sb.auth.getUser();if(!user)redirect('/login');
const {data:b}=await sb.from('bookings').select('*,properties(title,city)').eq('user_id',user.id).order('check_in',{ascending:false});
const {data:f}=await sb.from('favorites').select('properties(*)').eq('user_id',user.id);const today=new Date().toISOString().slice(0,10);
return <div className="mx-auto max-w-4xl px-4 py-10">{searchParams.ref&&<div role="status" className="mb-6 rounded-xl bg-teal/10 p-4 font-medium text-teal-dark">Booking confirmed! Reference: {searchParams.ref}</div>}
<h1 className="text-2xl font-bold">My bookings</h1><p className="text-gray-500">{user.email}</p>
<div className="mt-4 space-y-3">{!b?.length&&<p>No bookings yet.</p>}{b?.map((x:any)=><div key={x.id} className="card flex items-center justify-between p-4"><div><p className="font-semibold">{x.properties?.title} · {x.properties?.city}</p><p className="text-sm text-gray-500">{x.check_in} → {x.check_out} · {x.guests} guests · ${x.total_price} · {x.reference}</p></div>
<div className="text-right"><span className="rounded-full bg-soft px-3 py-1 text-xs capitalize">{x.status}</span>{x.status!=='cancelled'&&x.check_in>today&&<div className="mt-1"><CancelButton id={x.id}/></div>}</div></div>)}</div>
<h2 className="mb-4 mt-12 text-2xl font-bold">Saved stays</h2><div className="grid gap-6 sm:grid-cols-2">{f?.map((r:any)=>r.properties&&<PropertyCard key={r.properties.id} p={r.properties as Property} fav/>)}</div></div>}
