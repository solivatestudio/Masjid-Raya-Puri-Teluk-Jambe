const BASE = '/api';

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `API error: ${res.status}`);
  }
  return res.json();
}

// ── Transactions ──
export const transactionsApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params)}` : '';
    return fetcher<any[]>(`/transactions${qs}`);
  },
  create: (data: { date: string; description: string; type: string; category: string; amount: number }) =>
    fetcher<any>('/transactions', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: string) =>
    fetcher<void>(`/transactions/${id}`, { method: 'DELETE' }),
  summary: () => fetcher<any>('/transactions/summary'),
  monthly: () => fetcher<any[]>('/transactions/monthly'),
};

// ── Bookings ──
export const bookingsApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params)}` : '';
    return fetcher<any[]>(`/bookings${qs}`);
  },
  create: (data: any) =>
    fetcher<any>('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id: string, status: string, adminNotes?: string) =>
    fetcher<any>(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, adminNotes }) }),
  summary: () => fetcher<any>('/bookings/summary'),
  calendar: () => fetcher<string[]>('/bookings/calendar'),
};

// ── Pageviews ──
export const pageviewsApi = {
  record: (data: { path: string; referrer?: string; userAgent?: string; ipAddress?: string }) =>
    fetcher<void>('/pageviews', { method: 'POST', body: JSON.stringify(data) }),
  summary: () => fetcher<any>('/pageviews/summary'),
  recent: () => fetcher<any[]>('/pageviews/recent'),
};
