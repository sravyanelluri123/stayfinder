'use client';import {useState,useMemo} from 'react';
export default function BookingPanel({id,price,capacity}:{id:string;price:number;capacity:number}){
const [ci,setCi]=useState('');const [co,setCo]=useState('');const [g,setG]=useState(1);const [err,setErr]=useState('');const [busy,setBusy]=useState(false);
const today=new Date().toISOString().slice(0,10);
const nights=useMemo(()=>ci&&co?Math.round((+new Date(co)-+new Date(ci))/864e5):0,[ci,co]);
const sub=nights*price,fees=Math.round(sub*0.22*100)/100;
async function book(){setErr('');setBusy(true);const r=await fetch('/api/bookings',{method:'POST',body:JSON.stringify({propertyId:id,checkIn:ci,checkOut:co,guests:g})});const d=await r.json();setBusy(false);
if(r.status===401)return (location.href='/login');if(!r.ok)return setErr(d.error);location.href=`/dashboard?ref=${d.reference}`}
return <div className="card sticky top-24 space-y-3 p-5"><p className="text-2xl font-bold">${price} <span className="text-sm font-normal text-gray-500">/ night</span></p>
<label className="block text-sm">Check-in<input type="date" min={today} value={ci} onChange={e=>setCi(e.target.value)} className="input mt-1"/></label>
<label className="block text-sm">Check-out<input type="date" min={ci||today} value={co} onChange={e=>setCo(e.target.value)} className="input mt-1"/></label>
<label className="block text-sm">Guests<input type="number" min={1} max={capacity} value={g} onChange={e=>setG(+e.target.value)} className="input mt-1"/></label>
{nights>0&&<div className="space-y-1 border-t pt-3 text-sm"><div className="flex justify-between"><span>${price} × {nights} nights</span><span>${sub}</span></div><div className="flex justify-between"><span>Cleaning & service fees</span><span>${fees}</span></div><div className="flex justify-between font-bold"><span>Total</span><span>${(sub+fees).toFixed(2)}</span></div></div>}
{err&&<p role="alert" className="text-sm text-red-600">{err}</p>}
<button className="btn w-full" disabled={busy||nights<1||g<1||g>capacity} onClick={book}>{busy?'Booking…':'Reserve'}</button></div>}
