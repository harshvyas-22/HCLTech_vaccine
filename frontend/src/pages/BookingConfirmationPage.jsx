import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

export default function BookingConfirmationPage() {
  const { booking, clearBooking } = useBooking();
  const navigate = useNavigate();

  useEffect(() => {
    if (!booking.result) {
      navigate('/');
    }
  }, [booking, navigate]);

  if (!booking.result) {
    return null;
  }

  const result = booking.result;
  
  return (
    <div className="mx-auto max-w-3xl animate-fade-in space-y-10 pb-12">
      <div className="flex justify-center -mt-6 mb-4 relative z-10">
         <div className="w-24 h-24 rounded-full bg-neu-bg neu-card flex items-center justify-center text-accent-green mb-[-48px] border-4 border-white z-20">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
         </div>
      </div>

      <section className="neu-card p-10 md:p-14 pt-16 relative overflow-hidden bg-gradient-to-b from-white/40 to-transparent flex flex-col items-center text-center">
        
        <p className="neu-badge text-accent-green shadow-none bg-accent-green/10 border border-accent-green/20 mb-4">Confirmed</p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight drop-shadow-sm mb-4">Slot Successfully Booked</h1>
        <p className="text-gray-500 font-medium max-w-md">An official digital pass has been emailed to you. Please carry it along with your ID card to the hospital.</p>

        <div className="w-full mt-10 grid gap-6 sm:grid-cols-2">
          <div className="bg-neu-bg neu-inset p-6 sm:p-8 rounded-neu text-left flex flex-col items-center sm:items-start">
             <p className="text-xs uppercase font-extrabold text-gray-400 tracking-widest mb-2">Booking Reference</p>
             <p className="text-2xl font-black text-brand-700 font-mono tracking-wider">{result.bookingReference}</p>
          </div>
          <div className="bg-neu-bg neu-inset p-6 sm:p-8 rounded-neu text-left flex flex-col items-center sm:items-start">
             <p className="text-xs uppercase font-extrabold text-gray-400 tracking-widest mb-2">Amount Paid</p>
             <p className="text-2xl font-black text-gray-800 tracking-tight">₹{result.finalPrice}</p>
          </div>
        </div>

        <div className="w-full mt-10 p-8 sm:p-10 neu-card-sm bg-white/40 text-left border border-white/60">
           <h2 className="text-lg font-bold text-gray-800 mb-6 border-b border-neu-dark/20 pb-2">Appointment Details</h2>
           
           <div className="grid gap-6 sm:grid-cols-2">
             <div>
                <p className="neu-label !mb-1">Hospital</p>
                <p className="font-bold text-gray-800">{booking.hospital?.name}</p>
             </div>
             <div>
                <p className="neu-label !mb-1">Vaccine</p>
                <p className="font-bold text-gray-800 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                   {booking.vaccine?.name}
                </p>
             </div>
             <div>
                <p className="neu-label !mb-1">Date</p>
                <p className="font-bold text-brand-600">
                  {new Date(result.slotDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
             </div>
             <div>
                <p className="neu-label !mb-1">Dose Sequence</p>
                <p className="font-bold text-gray-800">Dose {result.doseNumber}</p>
             </div>
           </div>
        </div>

        <div className="w-full mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button
               type="button"
               onClick={() => {
                  clearBooking();
                  navigate('/bookings');
               }}
               className="neu-btn-primary px-8 py-4 "
            >
               Go to Dashboard
            </button>
            <button
               type="button"
               onClick={() => {
                  clearBooking();
                  navigate('/');
               }}
               className="neu-btn-ghost px-8 py-4 font-bold tracking-wide"
            >
               Back to Search
            </button>
        </div>
      </section>
    </div>
  );
}
