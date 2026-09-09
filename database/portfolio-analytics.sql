-- Apply to the chosen Supabase project. No client role can read or write raw analytics.
begin;
create schema if not exists portfolio_analytics;
revoke all on schema portfolio_analytics from public, anon, authenticated;
grant usage on schema portfolio_analytics to service_role;
create table if not exists portfolio_analytics.events (
 id uuid primary key, session_id uuid not null,
 kind text not null check(kind in ('view','click')),
 action text, country text not null, referrer text not null, device text not null,
 created_at timestamptz not null default now()
);
create index if not exists portfolio_events_time on portfolio_analytics.events(created_at desc);
create index if not exists portfolio_events_kind on portfolio_analytics.events(kind,created_at desc);
create table if not exists portfolio_analytics.sessions (
 id uuid primary key, last_seen timestamptz not null default now()
);
create index if not exists portfolio_sessions_seen on portfolio_analytics.sessions(last_seen);
create table if not exists portfolio_analytics.rate_limits (
 key text not null, minute timestamptz not null, hits integer not null,
 primary key(key,minute)
);
create index if not exists portfolio_rate_minute on portfolio_analytics.rate_limits(minute);
alter table portfolio_analytics.events enable row level security;
alter table portfolio_analytics.sessions enable row level security;
alter table portfolio_analytics.rate_limits enable row level security;
revoke all on all tables in schema portfolio_analytics from public,anon,authenticated;
grant select,insert,update,delete on all tables in schema portfolio_analytics to service_role;

create or replace function public.portfolio_collect(
 event_id uuid, session_id uuid, event_kind text, event_action text,
 event_country text, event_referrer text, event_device text, rate_key text
) returns boolean language plpgsql security invoker set search_path='' as $$
declare rate_hits integer;
begin
 if event_kind not in ('view','click','heartbeat') then return false; end if;
 insert into portfolio_analytics.rate_limits as limits(key,minute,hits)
 values(rate_key,date_trunc('minute',now()),1)
 on conflict(key,minute) do update set hits=limits.hits+1 returning hits into rate_hits;
 if rate_hits>90 then return false; end if;
 insert into portfolio_analytics.sessions(id,last_seen) values(session_id,now())
 on conflict(id) do update set last_seen=excluded.last_seen;
 if event_kind<>'heartbeat' then
  insert into portfolio_analytics.events(id,session_id,kind,action,country,referrer,device)
  values(event_id,session_id,event_kind,left(event_action,60),left(event_country,10),left(event_referrer,120),left(event_device,10))
  on conflict(id) do nothing;
 end if;
 delete from portfolio_analytics.rate_limits where minute<now()-interval '2 days';
 delete from portfolio_analytics.sessions where last_seen<now()-interval '1 day';
 return true;
end;
$$;
revoke all on function public.portfolio_collect(uuid,uuid,text,text,text,text,text,text) from public,anon,authenticated;
grant execute on function public.portfolio_collect(uuid,uuid,text,text,text,text,text,text) to service_role;

create or replace function public.portfolio_stats(detailed boolean default false)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare result jsonb;
begin
 select jsonb_build_object(
 'views',count(*) filter(where kind='view'),
 'clicks',count(*) filter(where kind='click'),
 'lastVisit',max(created_at) filter(where kind='view'),
 'active',(select count(*) from portfolio_analytics.sessions where last_seen>now()-interval '90 seconds'),
 'topLink',(select jsonb_build_object('name',action,'count',count(*)) from portfolio_analytics.events where kind='click' group by action order by count(*) desc,action limit 1),
 'daily',(select coalesce(jsonb_agg(jsonb_build_object('day',d.day,'views',d.views,'clicks',d.clicks) order by d.day),'[]'::jsonb) from (
  select day::date as day,count(e.id) filter(where e.kind='view') as views,count(e.id) filter(where e.kind='click') as clicks
  from generate_series(date_trunc('day',now() at time zone 'UTC')-interval '13 days',date_trunc('day',now() at time zone 'UTC'),interval '1 day') day
  left join portfolio_analytics.events e on e.created_at>=day at time zone 'UTC' and e.created_at<(day+interval '1 day') at time zone 'UTC'
  group by day
 ) d)
 ) into result from portfolio_analytics.events;
 if detailed then
  result=result || jsonb_build_object(
   'countries',(select coalesce(jsonb_agg(to_jsonb(t)),'[]'::jsonb) from (select country as name,count(*) as count from portfolio_analytics.events where kind='view' and created_at>now()-interval '30 days' group by country order by count(*) desc,country limit 15)t),
   'referrers',(select coalesce(jsonb_agg(to_jsonb(t)),'[]'::jsonb) from (select referrer as name,count(*) as count from portfolio_analytics.events where kind='view' and created_at>now()-interval '30 days' group by referrer order by count(*) desc,referrer limit 15)t),
   'devices',(select coalesce(jsonb_agg(to_jsonb(t)),'[]'::jsonb) from (select device as name,count(*) as count from portfolio_analytics.events where kind='view' and created_at>now()-interval '30 days' group by device order by count(*) desc,device)t),
   'links',(select coalesce(jsonb_agg(to_jsonb(t)),'[]'::jsonb) from (select action as name,count(*) as count from portfolio_analytics.events where kind='click' and created_at>now()-interval '30 days' group by action order by count(*) desc,action limit 20)t),
   'recent',(select coalesce(jsonb_agg(to_jsonb(t)),'[]'::jsonb) from (select kind,action,country,created_at from portfolio_analytics.events order by created_at desc limit 25)t)
  );
 end if;
 return result;
end;
$$;
revoke all on function public.portfolio_stats(boolean) from public,anon,authenticated;
grant execute on function public.portfolio_stats(boolean) to service_role;
commit;
