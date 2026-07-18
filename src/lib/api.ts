async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    credentials: 'include',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `API error: ${res.status}`);
  }
  return res.json();
}

const BASE = '/api';

export const transactionsApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params)}` : '';
    return fetcher<any[]>(`${BASE}/transactions${qs}`);
  },
  create: (data: { date: string; description: string; type: string; category: string; amount: number }) =>
    fetcher<any>(`${BASE}/transactions`, { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: string) => fetcher<void>(`${BASE}/transactions/${id}`, { method: 'DELETE' }),
  summary: () => fetcher<any>(`${BASE}/transactions/summary`),
  monthly: () => fetcher<any[]>(`${BASE}/transactions/monthly`),
};

export const bookingsApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params)}` : '';
    return fetcher<any[]>(`${BASE}/bookings${qs}`);
  },
  create: (data: any) => fetcher<any>(`${BASE}/bookings`, { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id: string, status: string, adminNotes?: string) =>
    fetcher<any>(`${BASE}/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, adminNotes }) }),
  summary: () => fetcher<any>(`${BASE}/bookings/summary`),
  calendar: () => fetcher<string[]>(`${BASE}/bookings/calendar`),
};

export const pageviewsApi = {
  record: (data: { path: string; referrer?: string; userAgent?: string }) =>
    fetcher<void>(`${BASE}/pageviews`, { method: 'POST', body: JSON.stringify(data) }),
  summary: () => fetcher<any>(`${BASE}/pageviews/summary`),
  recent: () => fetcher<any[]>(`${BASE}/pageviews/recent`),
};
