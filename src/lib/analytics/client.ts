import type { TrafficSummary } from './types';

type SummaryResult = { available: boolean; data?: TrafficSummary };
let initial: Promise<SummaryResult> | undefined;
let started = 0;

// The loader and footer consume the same first request, including in StrictMode.
export function loadTrafficSummary(initialRequest = true): Promise<SummaryResult> {
  if (initialRequest && initial && Date.now() - started < 15000) return initial;
  const request = fetch('/api/analytics/summary', {
    cache: 'no-store', signal: AbortSignal.timeout(5000),
  }).then(async response => {
    if (!response.ok) return { available: false };
    const result = await response.json();
    return { available: Boolean(result.available && result.data), data: result.data };
  }).catch(() => ({ available: false }));
  if (initialRequest) { initial = request; started = Date.now(); }
  return request;
}
