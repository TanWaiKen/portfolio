import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sameOrigin,sign,signingKey,safeEqual,noStore } from '@/lib/analytics/server';
export async function POST(request: Request){
 if(!sameOrigin(request))return new NextResponse(null,{status:403});
 if(signingKey().length<32)return NextResponse.json({error:'Owner access is not configured.'},{status:503,headers:noStore});
 const text=await request.text();if(text.length>300)return new NextResponse(null,{status:413});
 let secret='';try{secret=JSON.parse(text).secret || '';}catch{return new NextResponse(null,{status:400});}
 if(typeof secret!=='string' || !safeEqual(secret,signingKey()))return NextResponse.json({error:'Access key not accepted.'},{status:401,headers:noStore});
 const expiry=String(Date.now()+12*3600000);
 (await cookies()).set('portfolio_analytics_admin',`${expiry}.${sign(expiry)}`,{httpOnly:true,sameSite:'strict',secure:process.env.NODE_ENV==='production',path:'/api/analytics',maxAge:43200});
 return NextResponse.json({ok:true},{headers:noStore});
}
export async function DELETE(request: Request){
 if(!sameOrigin(request))return new NextResponse(null,{status:403});
 (await cookies()).set('portfolio_analytics_admin','',{httpOnly:true,sameSite:'strict',secure:process.env.NODE_ENV==='production',path:'/api/analytics',maxAge:0});
 return NextResponse.json({ok:true},{headers:noStore});
}
