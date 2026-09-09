import { NextResponse } from 'next/server';
import { actions } from '@/lib/analytics/types';
import { configured, rpc, sameOrigin, requesterBucket, noStore } from '@/lib/analytics/server';
export const runtime='nodejs';
export async function POST(request: Request) {
  if (!sameOrigin(request)) return new NextResponse(null,{status:403});
  if (!configured()) return NextResponse.json({available:false},{status:503,headers:noStore});
  if (request.headers.get('dnt')==='1' || request.headers.get('sec-gpc')==='1') return new NextResponse(null,{status:204});
  if (/bot|crawler|spider|headless/i.test(request.headers.get('user-agent') || '')) return new NextResponse(null,{status:204});
  try {
    const text=await request.text();if(text.length>1500)return new NextResponse(null,{status:413});
    let data;
    try { data=JSON.parse(text); } catch { return new NextResponse(null,{status:400}); }
    if(!data || typeof data!=='object' || Array.isArray(data))return new NextResponse(null,{status:400});
    const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if(!uuid.test(data.id) || !uuid.test(data.session) || !['view','click','heartbeat'].includes(data.kind))return new NextResponse(null,{status:400});
    if(data.kind==='click' && !actions.includes(data.action))return new NextResponse(null,{status:400});
    let referrer='Direct';
    if(data.kind==='view' && typeof data.referrer==='string' && data.referrer.length<=400){try{const parsed=new URL(data.referrer);if(['https:','http:'].includes(parsed.protocol))referrer=parsed.hostname.slice(0,120);}catch{}}
    const code=process.env.VERCEL ? request.headers.get('x-vercel-ip-country') || '' : '';
    const country=/^[A-Z]{2}$/.test(code)?code:'Unknown';
    const ua=request.headers.get('user-agent') || '';
    const device=/ipad|tablet/i.test(ua)?'Tablet':/mobile|android|iphone/i.test(ua)?'Mobile':'Desktop';
    const accepted=await rpc<boolean>('portfolio_collect',{event_id:data.id,session_id:data.session,event_kind:data.kind,event_action:data.kind==='click'?data.action:null,event_country:country,event_referrer:referrer,event_device:device,rate_key:requesterBucket(request)});
    return new NextResponse(null,{status:accepted?204:429,headers:noStore});
  }catch{return NextResponse.json({available:false},{status:503,headers:noStore});}
}
