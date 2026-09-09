"use client";
import { useEffect, useState, type FormEvent } from 'react';
import { actionLabels, type TrafficDetails } from '@/lib/analytics/types';
import { Sparkline } from '@/components/portfolio/TrafficAnalytics';
const countryName=(name:string)=>{try{return name==='Unknown'?'Unknown / unavailable':new Intl.DisplayNames(['en'],{type:'region'}).of(name) || name;}catch{return name;}};
function Breakdown({title,rows,countries=false}:{title:string;rows:{name:string;count:number}[];countries?:boolean}){
 const maximum=Math.max(1,...rows.map(row=>row.count));
 return <section className="analytics-panel"><h2>{title}</h2>{rows.length?<ol className="analytics-breakdown">{rows.map(row=><li key={row.name}><div><span>{countries?countryName(row.name):actionLabels[row.name] || row.name}</span><strong>{row.count.toLocaleString()}</strong></div><span className="analytics-bar" style={{width:`${row.count/maximum*100}%`}} /></li>)}</ol>:<p className="analytics-empty">No events in this period yet.</p>}</section>;
}
export function AnalyticsDashboard(){
 const [authenticated,setAuthenticated]=useState(false),[checking,setChecking]=useState(true),[secret,setSecret]=useState(''),[error,setError]=useState('');
 const [data,setData]=useState<TrafficDetails|null>(null),[available,setAvailable]=useState(false),[connected,setConnected]=useState(false),[updated,setUpdated]=useState(''),[paused,setPaused]=useState(false);
 useEffect(()=>{const controller=new AbortController();fetch('/api/analytics/details',{cache:'no-store',signal:controller.signal}).then(async response=>{if(response.status===401)return;const result=await response.json();setAuthenticated(true);setAvailable(Boolean(result.available));if(result.data)setData(result.data);}).catch(()=>{}).finally(()=>{if(!controller.signal.aborted)setChecking(false);});return()=>controller.abort();},[]);
 useEffect(()=>{
  if(!authenticated || paused)return;
  let source:EventSource|null=null;
  const start=()=>{source?.close();if(document.hidden){setConnected(false);return;}source=new EventSource('/api/analytics/stream');source.onopen=()=>setConnected(true);source.onerror=()=>setConnected(false);source.addEventListener('snapshot',event=>{try{const result=JSON.parse((event as MessageEvent).data);setAvailable(Boolean(result.available));if(result.available){setData(result.data);setUpdated(new Date().toLocaleTimeString());}}catch{setConnected(false);}});};
  start();document.addEventListener('visibilitychange',start);return()=>{source?.close();document.removeEventListener('visibilitychange',start);setConnected(false);};
 },[authenticated,paused]);
 const login=async(event:FormEvent)=>{event.preventDefault();setError('');try{const response=await fetch('/api/analytics/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret})});const result=await response.json();if(!response.ok){setError(result.error || 'Could not sign in.');return;}setSecret('');setAuthenticated(true);}catch{setError('Connection unavailable. Please try again.');}};
 const logout=async()=>{await fetch('/api/analytics/session',{method:'DELETE'});setAuthenticated(false);setData(null);setAvailable(false);};
 return <main className="analytics-page">
  <header className="analytics-header"><a href="/">← Back to Tan Wai Ken</a>{authenticated&&<button onClick={logout}>Sign out</button>}</header>
  <div className="analytics-title"><p>Behind the portfolio</p><h1>Traffic notebook.</h1><p>A closer look at what brings people here, and what catches their interest.</p></div>
  {checking?<p role="status">Checking owner access…</p>:!authenticated?<form className="analytics-login" onSubmit={login}><h2>For the owner.</h2><p>Sign in to see detailed traffic. The portfolio only shows aggregate counts.</p><label htmlFor="analytics-key">Owner access key</label><input id="analytics-key" type="password" autoComplete="current-password" value={secret} onChange={event=>setSecret(event.target.value)} required maxLength={256}/><button className="button primary" type="submit">Open notebook ↗</button><p role="alert">{error}</p></form>:<>
   <div className="analytics-stream"><span><i className={connected&&available&&!paused?'traffic-dot active':'traffic-dot'}/>{paused?'Updates paused':!available?'Waiting for the analytics connection':connected?'Live stream · checks every 5 seconds':'Reconnecting…'}</span><button onClick={()=>setPaused(value=>!value)}>{paused?'Resume updates':'Pause updates'}</button></div>
   {!available&&<p className="analytics-connection" role="status">{data?'The connection is temporarily unavailable. Last received figures remain below.':'Analytics is not connected yet. No visitor counts are being invented.'}</p>}
   <div className="analytics-totals"><div><h2>Page views · all time</h2><strong>{data?data.views.toLocaleString():'—'}</strong></div><div><h2>Tracked clicks · all time</h2><strong>{data?data.clicks.toLocaleString():'—'}</strong></div><div><h2>Active sessions · last 90s</h2><strong>{data?data.active.toLocaleString():'—'}</strong></div></div>
   <section className="analytics-panel analytics-trend"><h2>The last 14 days <small>UTC</small></h2><Sparkline values={data?.daily.map(day=>day.views)||[]} label="Page views per day over the last 14 days"/><div className="analytics-chart-dates"><span>{data?.daily[0]?.day || '—'}</span><span>{data?.daily.at(-1)?.day || '—'}</span></div></section>
   <p className="analytics-period">Breakdowns below cover the last 30 days. Countries are approximate, based on network location.</p>
   <div className="analytics-columns"><Breakdown title="Where people arrive from" rows={data?.referrers || []}/><Breakdown title="Countries & regions" rows={data?.countries || []} countries/><Breakdown title="What people click" rows={data?.links || []}/><Breakdown title="Devices" rows={data?.devices || []}/></div>
   <section className="analytics-panel"><h2>Recent activity</h2>{data?.recent.length?<div className="analytics-table-wrap"><table><thead><tr><th>Time</th><th>Activity</th><th>Country</th></tr></thead><tbody>{data.recent.map((event,index)=><tr key={`${event.created_at}-${index}`}><td>{new Date(event.created_at).toLocaleTimeString()}</td><td>{event.kind==='view'?'Portfolio viewed':actionLabels[event.action || ''] || 'Click'}</td><td>{countryName(event.country)}</td></tr>)}</tbody></table></div>:<p className="analytics-empty">Activity will appear here as events arrive.</p>}</section>
   <p className="analytics-footnote">{updated?`Last received ${updated}. `:''}Counts are indicative, not audited unique-person totals. No raw IP addresses or precise coordinates are stored. <a href="/privacy">Measurement details</a></p>
  </>}
 </main>;
}
