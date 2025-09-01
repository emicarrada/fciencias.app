'use client';

import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics';

/**
 * Component that automatically tracks page views with Google Analytics
 * Should be included in the main layout or app component
 */
export default function AnalyticsTracker() {
  useGoogleAnalytics();
  return null;
}
