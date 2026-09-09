import { NextResponse } from 'next/server';
import { isAdmin,configured,rpc,noStore } from '@/lib/analytics/server';
export const dynamic='force-dynamic';
export async function GET(){
 if(!await isAdmin())return NextResponse.json({error:'Sign in required'},{status:401,headers:noStore});
 if(!configured())return NextResponse.json({available:false},{headers:noStore});
 try{return NextResponse.json({available:true,data:await rpc('portfolio_stats',{detailed:true})},{headers:noStore});}
 catch{return NextResponse.json({available:false},{status:503,headers:noStore});}
}
