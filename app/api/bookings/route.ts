import {NextResponse} from 'next/server';import {supabaseServer} from '@/lib/supabase/server';
export async function POST(req:Request){const sb=supabaseServer();const {data:{user}}=await sb.auth.getUser();if(!user)return NextResponse.json({error:'Please sign in.'},{status:401});
const {propertyId,checkIn,checkOut,guests}=await req.json();const a=new Date(checkIn),b=new Date(checkOut),today=new Date(new Date().toISOString().slice(0,10));
if(isNaN(+a)||isNaN(+b)||a<today||b<=a)return NextResponse.json({error:'Invalid date range.'},{status:400});
const {data:p}=await sb.from('properties').select('price_per_night,capacity').eq('id',propertyId).single();if(!p)return NextResponse.json({error:'Property not found.'},{status:404});
if(!Number.isInteger(guests)||guests<1||guests>p.capacity)return NextResponse.json({error:`Guests must be 1–${p.capacity}.`},{status:400});
const nights=Math.round((+b-+a)/864e5);const sub=nights*Number(p.price_per_night);const total=Math.round(sub*1.22*100)/100;
const reference='SF-'+crypto.randomUUID().slice(0,8).toUpperCase();
const {error}=await sb.from('bookings').insert({user_id:user.id,property_id:propertyId,check_in:checkIn,check_out:checkOut,guests,total_price:total,reference,status:'confirmed'});
if(error)return NextResponse.json({error:error.code==='23P01'?'Those dates are already booked.':'Booking failed. Please try again.'},{status:error.code==='23P01'?409:500});
return NextResponse.json({reference})}
