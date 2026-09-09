"use client";
import { useEffect, useState } from 'react';
import { actionLabels, type AnalyticsAction, type TrafficSummary } from '@/lib/analytics/types';
import { loadTrafficSummary } from '@/lib/analytics/client';

declare global { interface Window { portfolioViewId?: string } }
function actionFor(element: Element): AnalyticsAction | null {
 const href=element.getAttribute('href') || '';
 if(element.matches('.lanyard-flip'))return 'flip_card';
 if(href.includes('linkedin.com'))return 'linkedin';
 if(href.includes('github.com'))return 'github';
 if(href.startsWith('mailto:') || element.getAttribute('aria-label')==='Copy email address')return 'email';
 if(href.startsWith('tel:'))return 'phone';
 if(href.endsWith('.pdf'))return 'resume';
 const sections=['about','journey','portfolio','recognition','playground','contact'];
 if(href.startsWith('#') && sections.includes(href.slice(1)))return `nav_${href.slice(1)}` as AnalyticsAction;
 const name=element.getAttribute('aria-label') || '';
 const projects: [string,AnalyticsAction][]=[['JusAds','project_jusads'],['CrediSecure','project_credisecure'],['iPocket','project_ipocket'],['Invoice','project_invoice'],['Yumesession','project_yumesession'],['VPet','project_vpet']];
 if(name.startsWith('Open '))return projects.find(([label])=>name.includes(label))?.[1] || null;
 return null;
}
export function TrafficTracker(){
 useEffect(()=>{
  if(navigator.doNotTrack==='1' || (navigator as Navigator & {globalPrivacyControl?:boolean}).globalPrivacyControl)return;
  let enabled=true;
  let session='';
  try{session=sessionStorage.getItem('portfolio_session') || crypto.randomUUID();sessionStorage.setItem('portfolio_session',session);}catch{session=crypto.randomUUID();}
  window.portfolioViewId ||= crypto.randomUUID();
  const send=(kind:'view'|'click'|'heartbeat',action?:AnalyticsAction)=>{
   if(!enabled || document.hidden)return;
   const payload={id:kind==='view'?window.portfolioViewId:crypto.randomUUID(),session,kind,action,referrer:kind==='view'?document.referrer:undefined};
   fetch('/api/analytics/collect',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),keepalive:true}).then(response=>{if(response.status===503)enabled=false;}).catch(()=>{});
  };
  send('view');
  const clicked=(event: MouseEvent)=>{const element=event.target instanceof Element?event.target.closest('a,button'):null;if(!element || element.closest('.portfolio-loader') || element.hasAttribute('disabled'))return;const action=actionFor(element);if(action)send('click',action);};
  document.addEventListener('click',clicked);
  const heartbeat=setInterval(()=>send('heartbeat'),30000);
  const resume=()=>{if(!document.hidden)send('heartbeat');};document.addEventListener('visibilitychange',resume);
  return()=>{enabled=false;clearInterval(heartbeat);document.removeEventListener('click',clicked);document.removeEventListener('visibilitychange',resume);};
 },[]);
 return null;
}
export function Sparkline({values,label}:{values:number[];label:string}){
 const max=Math.max(1,...values);
 return <div className="traffic-spark" role="img" aria-label={label}>{values.map((value,index)=><span key={index} style={{height:value?`${Math.max(8,value/max*100)}%`:'2px',opacity:value?1:.3}} />)}</div>;
}
export function LiveTraffic(){
 const [data,setData]=useState<TrafficSummary|null>(null);
 const [available,setAvailable]=useState(false);
 const [updated,setUpdated]=useState<string|null>(null);
 useEffect(()=>{
  let cancelled=false,pending=false;
  const update=async(initial=false)=>{if((document.hidden && !initial) || pending)return;pending=true;const value=await loadTrafficSummary(initial);if(!cancelled){setAvailable(value.available);if(value.available && value.data){setData(value.data);setUpdated(new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}));}}pending=false;};
  void update(true);const refresh=()=>{void update();};const timer=setInterval(refresh,15000);document.addEventListener('visibilitychange',refresh);
  return()=>{cancelled=true;clearInterval(timer);document.removeEventListener('visibilitychange',refresh);};
 },[]);
 const fmt=(value:number|undefined)=>value===undefined?'—':new Intl.NumberFormat().format(value);
 return <section className="live-traffic section-wrap" aria-labelledby="traffic-heading">
  <div className="traffic-heading"><h2 id="traffic-heading"><span className={available?'traffic-dot active':'traffic-dot'} />A little traffic through here.</h2><span>{available?`${data?.active || 0} active · refreshes every 15s`:data?'Updates temporarily paused':'Traffic is not available yet'}</span></div>
  <div className="traffic-grid">
   <div><h3>Page views</h3><strong>{fmt(data?.views)}</strong><Sparkline values={data?.daily.map(day=>day.views) || []} label="Daily page views over the last 14 days" /></div>
   <div><h3>Tracked clicks</h3><strong>{fmt(data?.clicks)}</strong><Sparkline values={data?.daily.map(day=>day.clicks) || []} label="Daily tracked clicks over the last 14 days" /></div>
   <div><h3>Most clicked</h3><strong className="traffic-name">{data?.topLink?actionLabels[data.topLink.name] || data.topLink.name:'—'}</strong><p>{data?.topLink?`${data.topLink.count} clicks`:'Waiting for the first click'}</p></div>
   <div><h3>Latest visit</h3><strong className="traffic-name">{data?.lastVisit?new Date(data.lastVisit).toLocaleDateString([], {month:'short',day:'numeric'}):'—'}</strong><p>{data?.lastVisit?new Date(data.lastVisit).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}):'No recorded visit yet'}</p></div>
  </div>
  <p className="traffic-note">Page views include repeat visits. Active means a session seen in the last 90 seconds.{updated?` Updated ${updated}.`:''} <a href="/privacy">About these counts</a></p>
 </section>;
}
