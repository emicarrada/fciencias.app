import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID!, {
      page_path: url,
    });
  }
};

// Track events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Custom hook to track page views
export const useGoogleAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (GA_MEASUREMENT_ID && process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true') {
      const url = pathname + (searchParams?.toString() || '');
      pageview(url);
    }
  }, [pathname, searchParams]);
};

// Common events for the academic platform
export const trackEvent = {
  // Auth events
  login: () => event({ action: 'login', category: 'auth' }),
  register: () => event({ action: 'register', category: 'auth' }),
  logout: () => event({ action: 'logout', category: 'auth' }),

  // Content interactions
  announcementView: (id: string) => 
    event({ action: 'view', category: 'announcement', label: id }),
  announcementReaction: (type: string, id: string) => 
    event({ action: 'reaction', category: 'announcement', label: `${type}_${id}` }),
  announcementShare: (id: string) => 
    event({ action: 'share', category: 'announcement', label: id }),

  // Event interactions
  eventView: (id: string) => 
    event({ action: 'view', category: 'event', label: id }),
  eventRegister: (id: string) => 
    event({ action: 'register', category: 'event', label: id }),
  eventShare: (id: string) => 
    event({ action: 'share', category: 'event', label: id }),

  // Community interactions
  communityView: (id: string) => 
    event({ action: 'view', category: 'community', label: id }),
  communityJoin: (id: string) => 
    event({ action: 'join', category: 'community', label: id }),
  communityLeave: (id: string) => 
    event({ action: 'leave', category: 'community', label: id }),

  // Search and navigation
  search: (query: string, category: string) => 
    event({ action: 'search', category: 'navigation', label: `${category}_${query}` }),
  filterApply: (filterType: string, value: string) => 
    event({ action: 'filter', category: 'navigation', label: `${filterType}_${value}` }),

  // Profile interactions
  profileEdit: () => event({ action: 'edit', category: 'profile' }),
  profileView: (userId?: string) => 
    event({ action: 'view', category: 'profile', label: userId }),

  // Admin actions
  contentModerate: (action: string, contentType: string, contentId: string) => 
    event({ 
      action: 'moderate', 
      category: 'admin', 
      label: `${action}_${contentType}_${contentId}` 
    }),
};
