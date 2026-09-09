import { NextResponse } from 'next/server';
import { configured,rpc,noStore } from '@/lib/analytics/server';
import type {TrafficDetails} from '@/lib/analytics/types';
export const dynamic='force-dynamic';
export async function GET(){
 if(!configured())return NextResponse.json({available:false},{headers:noStore});
 try{const result=await rpc<TrafficDetails>('portfolio_stats',{detailed:false});
 const {views,clicks,active,lastVisit,topLink,daily}=result;
 return NextResponse.json({available:true,data:{views,clicks,active,lastVisit,topLink,daily}},{headers:noStore});
 }catch{return NextResponse.json({available:false},{status:503,headers:noStore});}
}
