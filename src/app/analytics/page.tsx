import type { Metadata } from 'next';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
export const metadata:Metadata={title:'Traffic notebook · Tan Wai Ken',robots:{index:false,follow:false}};
export default function AnalyticsPage(){return <AnalyticsDashboard/>;}
