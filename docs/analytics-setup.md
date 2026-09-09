# Portfolio traffic analytics

The Supabase project `xebphrpnkblctswnsdja` contains the applied
`portfolio_traffic_analytics` migration from `database/portfolio-analytics.sql`.
Raw events live in a private schema with RLS enabled. Only the server service role
can execute collection and reporting functions. The browser never receives a database key.

## Vercel deployment

Add these server-only variables in the Vercel project's Environment Variables,
then deploy this revision. Their local values are in the gitignored `.env.local`:

- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`
- `ANALYTICS_ADMIN_SECRET` (generated random owner access key, at least 32 characters)

Do not prefix them with `NEXT_PUBLIC_`. This implementation does not require the
publishable key or JWKS URL. It uses server-side REST RPC and a signed HttpOnly
owner session cookie, rather than Supabase Auth user accounts.

Open `/analytics` and enter the `ANALYTICS_ADMIN_SECRET` value as the owner access
key. It is separate from the Supabase secret. Sessions expire after 12 hours.
Changing the owner key invalidates existing owner sessions after deployment.
The source and local database connection have been configured; Vercel environment
variables and production deployment have not been changed by this implementation.

## What is counted

- Page views count document loads, including reloads; not unique people.
- A session is a random per-tab sessionStorage ID. Active means a heartbeat in 90 seconds.
- Only recognized portfolio links, section navigation, project previews and card flips are tracked.
- Referrer stores only hostname. Countries come from Vercel's approximate network-country header;
  local development correctly reports Unknown. Devices are inferred from User-Agent.
- Public totals refresh every 15 seconds. Private SSE checks every 5 seconds and
  reconnects after each bounded server response. This incurs function/database usage.
- DNT/GPC and recognizable bots are excluded. These are indicative counts; scripted traffic
  can still inflate them. A daily hashed network bucket limits each bucket to 90 events/minute.
- Raw IP addresses, full referrer paths/queries and precise coordinates are not stored.
- Rate-limit rows older than two days and inactive sessions older than one day are removed on collection.
  Events currently remain until manually removed, to preserve all-time totals.

## Loading screen

Waits for the painted hero, guide image, fonts and card readiness. Resource failure
settles its stage; a 6.5-second deadline and an Enter portfolio button prevent lockout.
It does not wait for analytics or all below-fold assets. No JavaScript leaves the
dialog closed and portfolio content accessible.

## Verification

`node --env-file=.env.local scripts/analytics-qa.cjs` exercises the browser and real
server/database routes. Set `QA_URL` for the running server (default port 3001).
It records video and screenshots under the ignored `artifacts/visual-qa` folder.
Use a dedicated test project for future repeated runs: the test makes real events.
The sessions it writes are listed in `analytics-qa-sessions.json` for exact cleanup.
Never delete unrelated visitor records.

Verified: RPC duplicate-event deduplication, denied anonymous database access,
malformed input and foreign Origin rejection, DNT exclusion, private routes,
owner login, live click updates, pause/resume, logout, desktop and mobile layouts.

Production build and TypeScript validation passed. Generated client assets were
checked and contain neither server secret. Initial browser test records were
removed by their exact test session IDs; no production visitor records were removed.
The screenshots/video show the temporary verification events before cleanup.
