import { useEffect, useMemo, useState } from 'react';
import api from '../api/axiosConfig';
import LoadingSpinner from '../components/LoadingSpinner';
import BookingCard from '../components/BookingCard';
import CancelModal from '../components/CancelModal';
import RescheduleModal from '../components/RescheduleModal';
import { toast } from 'react-hot-toast';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await api.get('/bookings/my'); // Fixed API route
        const list = response.data.data?.bookings || response.data.bookings || [];
        setBookings(list);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load bookings.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => new Date(b.slotDate || b.date) - new Date(a.slotDate || a.date));
  }, [bookings]);

  const handleCancel = async (bookingWithReason) => {
    const promise = api.delete(`/bookings/${bookingWithReason._id}`); // Fixed API route DELETE
    toast.promise(promise, {
      loading: 'Cancelling booking...',
       success: () => {
         setBookings((prev) => prev.map((item) => (item._id === bookingWithReason._id ? { ...item, status: 'CANCELLED' } : item)));
         setCancelOpen(false);
         return 'Booking cancelled successfully.';
       },
       error: 'Unable to cancel the booking.',
    });
  };

  const handleReschedule = async (booking, newDate) => {
    const promise = api.put(`/bookings/${booking._id}`, { slotDate: newDate }); // Fixed ID payload
    toast.promise(promise, {
      loading: 'Rescheduling...',
      success: (res) => {
         const updated = res.data.data?.booking || res.data.booking;
         setBookings((prev) => prev.map((item) => (item._id === booking._id ? { ...item, slotDate: updated.slotDate } : item)));
         setRescheduleOpen(false);
         return 'Booking rescheduled successfully.';
      },
      error: (err) => err.response?.data?.message || 'Unable to reschedule booking.'
    });
  };

  const handleRebook = async (booking) => {
    const promise = api.post(`/bookings/${booking._id}/rebook`, {}); // Fixed API route POST /:id/rebook
    toast.promise(promise, {
       loading: 'Initiating rebook...',
       success: (res) => {
          const newBooking = res.data.data?.booking || res.data.booking;
          setBookings(prev => [newBooking, ...prev]);
          return 'Rebooked appointment created successfully!';
       },
       error: (err) => err.response?.data?.message || 'Unable to rebook appointment.'
    });
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <LoadingSpinner size="h-20 w-20" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl animate-fade-in space-y-10 pb-12">
      <header className="neu-card p-8 md:p-12 relative overflow-hidden">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-b from-brand-400 to-brand-600"></div>
        <div className="pl-4">
           <h1 className="text-4xl font-black text-gray-800 tracking-tight drop-shadow-sm mb-2">My Appointments</h1>
           <p className="text-gray-500 font-medium text-lg">Manage your upcoming doses and review completed history.</p>
        </div>
      </header>

      <section className="space-y-8">
        <div className="flex justify-between items-center bg-neu-bg neu-inset p-3 pl-6 rounded-neu">
           <p className="text-xs uppercase font-extrabold text-gray-500 tracking-widest">{sortedBookings.length} Total Bookings</p>
        </div>

        <div className="grid gap-8">
          {sortedBookings.length > 0 ? (
            sortedBookings.map((booking) => (
              <BookingCard
                key={booking._id || booking.id}
                booking={booking}
                onView={() => toast('Detailed digital pass is available in your email.')}
                onCancel={(item) => {
                  setSelectedBooking(item);
                  setCancelOpen(true);
                }}
                onReschedule={(item) => {
                  setSelectedBooking(item);
                  setRescheduleOpen(true);
                }}
                onRebook={handleRebook}
              />
            ))
          ) : (
            <div className="neu-card p-16 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full neu-inset-sm flex items-center justify-center text-gray-400 mb-6">
                 <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Booking History</h3>
              <p className="text-gray-500 font-medium">You haven't scheduled any vaccinations yet. Go to the home page to find a hospital.</p>
            </div>
          )}
        </div>
      </section>

      <CancelModal isOpen={cancelOpen} booking={selectedBooking} onClose={() => setCancelOpen(false)} onCancel={handleCancel} />
      <RescheduleModal isOpen={rescheduleOpen} booking={selectedBooking} onClose={() => setRescheduleOpen(false)} onReschedule={handleReschedule} />
    </div>
  );
}
