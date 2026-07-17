import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import OverviewPage from './pages/dashboard/OverviewPage';
import KeuanganPage from './pages/dashboard/KeuanganPage';
import BookingPage from './pages/dashboard/BookingPage';
import TrafikPage from './pages/dashboard/TrafikPage';
import { pageviewsApi } from './lib/api';

function PageviewTracker() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/dashboard')) return;

    const timer = setTimeout(() => {
      pageviewsApi.record({
        path: location.pathname + location.hash,
        referrer: document.referrer || undefined,
        userAgent: navigator.userAgent,
      }).catch(() => {});
    }, 200);

    return () => clearTimeout(timer);
  }, [location]);

  return null;
}

export default function App() {
  return (
    <>
      <PageviewTracker />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="keuangan" element={<KeuanganPage />} />
          <Route path="booking" element={<BookingPage />} />
          <Route path="trafik" element={<TrafikPage />} />
        </Route>
      </Routes>
    </>
  );
}
