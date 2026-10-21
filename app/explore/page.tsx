import {supabaseServer} from '@/lib/supabase/server';import PropertyCard from '@/components/PropertyCard';import type {Property} from '@/lib/types';import Link from 'next/link';
export const dynamic='force-dynamic';const PAGE=9;
export default async function Explore({searchParams:s}:{searchParams:Record<string,string>}){
const sb=supabaseServer();const page=Math.max(1,+(s.page||1));
let q=sb.from('properties').select('*',{count:'exact'});
if(s.q)q=q.or(`city.ilike.%${s.q.replace(/[,%()]/g,'')}%,title.ilike.%${s.q.replace(/[,%()]/g,'')}%`);
if(s.type)q=q.eq('property_type',s.type);if(s.category)q=q.eq('category',s.category);
if(s.min)q=q.gte('price_per_night',+s.min);if(s.max)q=q.lte('price_per_night',+s.max);
if(s.rating)q=q.gte('rating',+s.rating);if(s.guests)q=q.gte('capacity',+s.guests);if(s.amenity)q=q.contains('amenities',[s.amenity]);
const sort=s.sort||'popular';q=sort==='price_asc'?q.order('price_per_night'):sort==='price_desc'?q.order('price_per_night',{ascending:false}):sort==='rating'?q.order('rating',{ascending:false}):q.order('review_count',{ascending:false});
const {data,count}=await q.range((page-1)*PAGE,page*PAGE-1);
const {data:{user}}=await sb.auth.getUser();const favs=new Set(user?((await sb.from('favorites').select('property_id')).data||[]).map(f=>f.property_id):[]);
const qs=(p:number)=>'?'+new URLSearchParams({...s,page:String(p)});
return <div className="mx-auto max-w-6xl px-4 py-8"><form className="mb-8 grid gap-3 rounded-2xl bg-soft p-4 sm:grid-cols-3 lg:grid-cols-5">
<input name="q" defaultValue={s.q} placeholder="City or title" aria-label="Search" className="input"/>
<select name="type" defaultValue={s.type||''} aria-label="Type" className="input"><option value="">Any type</option>{['hotel','apartment','villa','homestay','rental'].map(t=><option key={t}>{t}</option>)}</select>
<input name="min" type="number" defaultValue={s.min} placeholder="Min $" aria-label="Min price" className="input"/><input name="max" type="number" defaultValue={s.max} placeholder="Max $" aria-label="Max price" className="input"/>
<input name="guests" type="number" min={1} defaultValue={s.guests} placeholder="Guests" aria-label="Guests" className="input"/>
<select name="rating" defaultValue={s.rating||''} aria-label="Rating" className="input"><option value="">Any rating</option><option value="4">4+</option><option value="4.5">4.5+</option></select>
<select name="amenity" defaultValue={s.amenity||''} aria-label="Amenity" className="input"><option value="">Any amenity</option>{['WiFi','Pool','Kitchen','AC','Parking','Spa'].map(a=><option key={a}>{a}</option>)}</select>
<select name="sort" defaultValue={sort} aria-label="Sort" className="input"><option value="popular">Popular</option><option value="rating">Top rated</option><option value="price_asc">Price ↑</option><option value="price_desc">Price ↓</option></select>
<button className="btn">Apply</button></form>
{!data?.length?<div className="py-20 text-center"><p className="text-xl font-semibold">No stays match your filters</p><Link href="/explore" className="btn mt-4">Clear filters</Link></div>:
<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{(data as Property[]).map(p=><PropertyCard key={p.id} p={p} fav={favs.has(p.id)}/>)}</div>}
<div className="mt-8 flex justify-center gap-4">{page>1&&<Link className="btn" href={qs(page-1)}>Previous</Link>}{(count||0)>page*PAGE&&<Link className="btn" href={qs(page+1)}>Next</Link>}</div></div>}
