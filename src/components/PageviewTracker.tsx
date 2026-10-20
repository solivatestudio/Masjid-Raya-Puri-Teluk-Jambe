'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageviewsApi } from '@/lib/api';

export default function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname.startsWith('/dashboard')) return;
    const timer = setTimeout(() => {
      pageviewsApi
        .record({
          path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''),
          referrer: document.referrer || undefined,
          userAgent: navigator.userAgent,
        })
        .catch(() => {});
    }, 200);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}
