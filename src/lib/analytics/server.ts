import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
export const configured = () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);
export async function rpc<T>(name: string, body: object = {}): Promise<T> {
  if (!configured()) throw new Error('Analytics is not connected');
  const secret = process.env.SUPABASE_SECRET_KEY!;
  const response = await fetch(`${process.env.SUPABASE_URL!.replace(/\/$/,'')}/rest/v1/rpc/${name}`, {
    method:'POST', headers:{'Content-Type':'application/json',apikey:secret,...(secret.startsWith('eyJ') ? {Authorization:`Bearer ${secret}`} : {})},
    body:JSON.stringify(body), cache:'no-store', signal:AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error('Analytics storage is unavailable');
  return response.json();
}
export const signingKey = () => process.env.ANALYTICS_ADMIN_SECRET || '';
export function safeEqual(a: string, b: string) {
  const left=Buffer.from(a),right=Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left,right);
}
export function sign(value: string) { return createHmac('sha256',signingKey()).update(value).digest('base64url'); }
export async function isAdmin() {
  if (signingKey().length < 32) return false;
  const token=(await cookies()).get('portfolio_analytics_admin')?.value || '';
  const [expiry,signature]=token.split('.');
  return /^\d+$/.test(expiry || '') && Number(expiry)>Date.now() && Number(expiry)<Date.now()+13*3600000 && safeEqual(signature || '',sign(expiry));
}
export function sameOrigin(request: Request) {
  const origin=request.headers.get('origin');
  if(!origin)return false;
  try {
    const source=new URL(origin);
    // Next may normalize request.url to localhost behind its server proxy.
    // Compare the browser origin to the actual HTTP Host, not that internal URL.
    return ['http:','https:'].includes(source.protocol) && source.host === (request.headers.get('host') || new URL(request.url).host);
  } catch { return false; }
}
export function requesterBucket(request: Request) {
  const ip=process.env.VERCEL ? request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for') || 'unknown' : 'local';
  return createHmac('sha256',process.env.SUPABASE_SECRET_KEY || signingKey()).update(`${new Date().toISOString().slice(0,10)}:${ip.split(',')[0].trim()}`).digest('hex');
}
export const noStore = {'Cache-Control':'no-store'};
