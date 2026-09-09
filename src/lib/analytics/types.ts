export const actions = ['github', 'linkedin', 'email', 'phone', 'resume', 'project_jusads', 'project_credisecure', 'project_ipocket', 'project_invoice', 'project_yumesession', 'project_vpet', 'nav_about', 'nav_journey', 'nav_portfolio', 'nav_recognition', 'nav_playground', 'nav_contact', 'flip_card'] as const;
export type AnalyticsAction = typeof actions[number];
export interface TrafficSummary {
  views: number; clicks: number; active: number; lastVisit: string | null;
  topLink: {name: string; count: number} | null;
  daily: {day: string; views: number; clicks: number}[];
}
export interface TrafficDetails extends TrafficSummary {
  countries: {name: string; count: number}[];
  referrers: {name: string; count: number}[];
  links: {name: string; count: number}[];
  devices: {name: string; count: number}[];
  recent: {kind: string; action: string | null; country: string; created_at: string}[];
}
export const actionLabels: Record<string,string> = {github:'GitHub',linkedin:'LinkedIn',email:'Email',phone:'Phone',resume:'Résumé',project_jusads:'JusAds',project_credisecure:'CrediSecure AI',project_ipocket:'iPocket',project_invoice:'Invoice → Excel',project_yumesession:'Yumesession AI',project_vpet:'VPet AI',nav_about:'About',nav_journey:'Experience',nav_portfolio:'Projects',nav_recognition:'Achievements',nav_playground:'Playground',nav_contact:'Contact',flip_card:'Flip card'};
