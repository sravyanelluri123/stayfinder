import {NextResponse} from 'next/server';import {supabaseServer} from '@/lib/supabase/server';
export async function POST(req:Request){const sb=supabaseServer();const {data:{user}}=await sb.auth.getUser();if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});
const {propertyId}=await req.json();const {data}=await sb.from('favorites').select('property_id').eq('property_id',propertyId).eq('user_id',user.id).maybeSingle();
if(data){await sb.from('favorites').delete().eq('property_id',propertyId).eq('user_id',user.id);return NextResponse.json({favorited:false})}
const {error}=await sb.from('favorites').insert({user_id:user.id,property_id:propertyId});return error?NextResponse.json({error:'Failed'},{status:500}):NextResponse.json({favorited:true})}
