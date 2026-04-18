import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/bookings');
      setBookings(response.data.data?.bookings || []);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const completeBooking = async (id) => {
    try {
      await api.put(`/admin/bookings/${id}/complete`);
      toast.success('Marked as completed');
      fetchBookings();
    } catch {
      toast.error('Failed to complete booking');
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="mx-auto max-w-7xl animate-fade-in space-y-10 pb-12">
      <header className="neu-card p-8">
         <h1 className="text-3xl font-black text-gray-800 tracking-tight drop-shadow-sm">All Bookings</h1>
      </header>

      <div className="neu-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-brand-50 text-xs uppercase text-brand-700 tracking-widest border-b border-neu-dark/20">
              <tr>
                <th className="px-6 py-4 font-bold">Ref</th>
                <th className="px-6 py-4 font-bold">Patient</th>
                <th className="px-6 py-4 font-bold">Hospital</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b border-neu-dark/10 hover:bg-white/50">
                  <td className="px-6 py-4 font-mono font-bold">{b.bookingReference}</td>
                  <td className="px-6 py-4 font-medium">{b.userId?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 font-medium">{b.hospitalId?.name}</td>
                  <td className="px-6 py-4">{new Date(b.slotDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        b.status === 'COMPLETED' ? 'bg-accent-green/20 text-accent-green' :
                        b.status === 'CANCELLED' ? 'bg-red-100 text-red-600' : 'bg-brand-100 text-brand-600'
                     }`}>
                        {b.status}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    {b.status === 'CONFIRMED' && (
                      <button onClick={() => completeBooking(b._id)} className="text-accent-green font-bold hover:underline">
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
