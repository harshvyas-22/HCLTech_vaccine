import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalHospitals: 0,
    totalVaccines: 0,
    totalBookings: 0,
    todayBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [hospitalsRes, vaccinesRes, bookingsRes, todayRes] = await Promise.all([
          api.get('/hospitals/search'), // Fixed API Route
          api.get('/vaccines'),
          api.get('/admin/bookings'),
          api.get(`/admin/bookings?date=${new Date().toISOString().split('T')[0]}`),
        ]);

        const hospitalsCount = hospitalsRes.data.data?.hospitals?.length || hospitalsRes.data.results || 0;
        const vaccinesCount = vaccinesRes.data.data?.vaccines?.length || vaccinesRes.data.results || 0;
        const bookingsCount = bookingsRes.data.data?.bookings?.length || bookingsRes.data.results || 0;
        const todayCount = todayRes.data.data?.bookings?.length || todayRes.data.results || 0;

        setStats({
          totalHospitals: hospitalsCount,
          totalVaccines: vaccinesCount,
          totalBookings: bookingsCount,
          todayBookings: todayCount,
        });
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <LoadingSpinner size="h-20 w-20" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Hospitals', value: stats.totalHospitals, icon: '🏥', color: 'brand' },
    { label: 'Total Vaccines', value: stats.totalVaccines, icon: '💉', color: 'accent-green' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: '📅', color: 'brand' },
    { label: 'Bookings Today', value: stats.todayBookings, icon: '🔥', color: 'accent-amber' },
  ];

  return (
    <div className="mx-auto max-w-7xl animate-fade-in space-y-10 pb-12">
      <header className="neu-card p-8 md:p-12 relative overflow-hidden bg-gradient-to-r from-neu-bg to-brand-50/20">
         <h1 className="text-4xl font-black text-gray-800 tracking-tight drop-shadow-sm mb-2">Admin Dashboard</h1>
         <p className="text-gray-500 font-medium text-lg">System Overview & Statistics</p>
      </header>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className="neu-card p-8 flex flex-col items-center text-center group hover:scale-[1.02] transition-transform">
             <div className="w-16 h-16 rounded-full neu-inset-sm flex items-center justify-center text-3xl mb-6">
                {stat.icon}
             </div>
             <p className="neu-label">{stat.label}</p>
             <p className={`text-5xl font-black mt-2 drop-shadow-sm ${stat.color === 'brand' ? 'text-brand-600' : stat.color === 'accent-green' ? 'text-accent-green' : 'text-accent-amber'}`}>
                {stat.value}
             </p>
          </div>
        ))}
      </div>
    </div>
  );
}
