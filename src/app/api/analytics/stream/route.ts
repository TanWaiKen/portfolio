import { isAdmin,configured,rpc } from '@/lib/analytics/server';
export const dynamic='force-dynamic';
export const runtime='nodejs';
export const maxDuration=60;
export async function GET(request: Request){
 if(!await isAdmin())return new Response(null,{status:401});
 const encoder=new TextEncoder();let cancelled=false;
 let cleanup=()=>{};
 const stream=new ReadableStream({
  start(controller){
   const started=Date.now();let previous='';let timer:ReturnType<typeof setTimeout>;
   const close=()=>{if(cancelled)return;cancelled=true;clearTimeout(timer);request.signal.removeEventListener('abort',close);try{controller.close();}catch{}};
   cleanup=close;
   request.signal.addEventListener('abort',close);
   const tick=async()=>{
    if(cancelled)return;
    try{
     const snapshot=configured()?{available:true,data:await rpc('portfolio_stats',{detailed:true})}:{available:false};
     if(cancelled)return;
     const payload=JSON.stringify(snapshot);
     if(payload!==previous){controller.enqueue(encoder.encode(`event: snapshot\ndata: ${payload}\n\n`));previous=payload;}
     else controller.enqueue(encoder.encode(': heartbeat\n\n'));
    }catch{if(!cancelled)controller.enqueue(encoder.encode('event: snapshot\ndata: {"available":false}\n\n'));}
    if(Date.now()-started>50000){close();return;}
    if(!cancelled)timer=setTimeout(tick,5000);
   };
   tick();
  },
  cancel(){cleanup();}
 });
 return new Response(stream,{headers:{'Content-Type':'text/event-stream','Cache-Control':'no-store','Connection':'keep-alive','X-Accel-Buffering':'no'}});
}
