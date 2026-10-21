'use client';import {useRouter} from 'next/navigation';
export default function CancelButton({id}:{id:string}){const r=useRouter();return <button className="text-sm text-red-600 underline" onClick={async()=>{if(!confirm('Cancel this booking?'))return;const x=await fetch(`/api/bookings/${id}`,{method:'PATCH'});if(x.ok)r.refresh();else alert((await x.json()).error)}}>Cancel</button>}
