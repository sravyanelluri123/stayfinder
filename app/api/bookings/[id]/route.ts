import {NextResponse} from 'next/server';import {supabaseServer} from '@/lib/supabase/server';
export async function PATCH(_:Request,{params}:{params:{id:string}}){const sb=supabaseServer();const {data:{user}}=await sb.auth.getUser();if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});
const {data:b}=await sb.from('bookings').select('check_in').eq('id',params.id).eq('user_id',user.id).single();
if(!b||b.check_in<=new Date().toISOString().slice(0,10))return NextResponse.json({error:'This booking cannot be cancelled.'},{status:400});
const {error}=await sb.from('bookings').update({status:'cancelled'}).eq('id',params.id).eq('user_id',user.id);
return error?NextResponse.json({error:'Cancel failed.'},{status:500}):NextResponse.json({ok:true})}
