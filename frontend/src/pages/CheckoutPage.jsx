import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useBooking } from '../context/BookingContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { booking, selectBooking, clearBooking } = useBooking();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!booking.hospital || !booking.vaccineId || !booking.slotDate) {
      navigate('/');
    }
  }, [booking, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        hospitalId: booking.hospital._id || booking.hospital.id,
        vaccineId: booking.vaccineId,
        slotDate: booking.slotDate,
        doseNumber: booking.doseNumber,
      };
      
      const response = await api.post('/bookings', payload);
      // Backend returns { status: 'success', data: { booking: {...} } }
      const bookedData = response.data.data?.booking || response.data.booking;
      
      // Keep only the result in context, clear the drafted booking
      selectBooking({ result: bookedData, ...booking }); // save the draft references too for confirmation page rendering
      toast.success('Slot successfully booked!');
      navigate('/confirmation');
    } catch (err) {
      setError(err.response?.data?.message || 'No slots available at selected time.');
      toast.error('Booking could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  if (!booking.hospital || !booking.vaccineId || !booking.slotDate) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl animate-fade-in space-y-10 pb-12">
      <div className="flex items-center gap-4 text-brand-600 mb-4 cursor-pointer" onClick={() => navigate(-1)}>
         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
         <span className="font-bold">Back to Hospital</span>
      </div>

      <section className="neu-card p-8 md:p-12 relative overflow-hidden">
        {/* Subtle texture bg */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-400 via-transparent to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-neu-dark/20 pb-8 mb-8">
           <div>
              <h1 className="text-3xl font-extrabold text-gray-800 drop-shadow-sm tracking-tight">Review Checkout</h1>
              <p className="mt-2 text-gray-500 font-medium tracking-wide">Confirm details before securing your vaccine slot.</p>
           </div>
           
           <div className="flex items-center gap-3 bg-brand-50 px-6 py-4 rounded-neu-lg shadow-neu-inset border border-white/60">
             <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-neu-flat shrink-0">
               <span className="font-bold tracking-tighter">₹</span>
             </div>
             <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Total Payment Due</p>
                <p className="text-2xl font-black text-brand-700 leading-none mt-1">₹{booking.price}</p>
             </div>
           </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-start relative z-10">
          
          <div className="space-y-8">
            <div className="bg-neu-bg neu-inset p-6 sm:p-8 rounded-neu-lg">
              <p className="neu-label flex items-center gap-2 mb-4 border-b border-neu-dark/10 pb-2">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                 Hospital Details
              </p>
              <h3 className="text-2xl font-black text-gray-800 mb-2">{booking.hospital.name}</h3>
              <p className="text-gray-600 font-medium flex items-start gap-2 max-w-sm">
                 <span className="mt-0.5">•</span>
                 {booking.hospital.address}, {booking.hospital.city} {booking.hospital.pincode}
              </p>
              <p className="text-brand-600 font-bold flex items-center gap-2 mt-2">
                 <span className="w-6 h-6 rounded-full neu-inset-sm flex center justify-center text-xs">☎</span>
                 {booking.hospital.phone || booking.hospital.contact}
              </p>
            </div>

            <div className="bg-neu-bg neu-inset p-6 sm:p-8 rounded-neu-lg">
              <p className="neu-label flex items-center gap-2 mb-4 border-b border-neu-dark/10 pb-2">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                 Patient Receiving Dose
              </p>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{user?.name || 'Guest User'}</h3>
              <p className="text-gray-500 font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="neu-card-sm p-6 sm:p-8 bg-white/40">
              <p className="neu-label flex items-center gap-2 mb-4">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 Slotted Appointment
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="neu-inset-sm p-4 rounded-xl bg-neu-bg">
                   <p className="text-xs uppercase font-bold text-gray-400 mb-1 tracking-widest">Vaccine</p>
                   <p className="font-extrabold text-gray-800">{booking.vaccine?.name || 'Selected Vaccine'}</p>
                </div>
                <div className="neu-inset-sm p-4 rounded-xl bg-neu-bg">
                   <p className="text-xs uppercase font-bold text-gray-400 mb-1 tracking-widest">Date</p>
                   <p className="font-extrabold text-brand-600">
                     {new Date(booking.slotDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}
                   </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                   <label htmlFor="doseNumber" className="neu-label ml-1">Dose Sequence</label>
                   <div className="relative">
                      <select
                        id="doseNumber"
                        value={booking.doseNumber}
                        onChange={(e) => selectBooking({ doseNumber: parseInt(e.target.value) })}
                        className="neu-select text-lg font-bold text-gray-800 h-14"
                        aria-label="Select dose number"
                      >
                        <option value={1}>Dose #1 (First Time)</option>
                        <option value={2}>Dose #2 (Second Shot)</option>
                        <option value={3}>Dose #3 (Booster)</option>
                      </select>
                   </div>
                </div>

                {error && (
                  <div className="bg-red-100 p-4 rounded-xl shadow-neu-inset-sm border border-red-200 animation-slide-up">
                    <p className="text-sm font-bold text-red-600 flex items-start gap-2">
                      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                      {error}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="neu-btn-primary w-full py-5 text-base tracking-widest uppercase shadow-[6px_6px_14px_rgba(31,95,111,0.4),_-6px_-6px_14px_rgba(255,255,255,0.7)]"
                >
                  {loading ? <LoadingSpinner size="h-6 w-6" /> : 'Confirm & Book Slot'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
