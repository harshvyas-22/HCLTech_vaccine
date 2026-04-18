export default function BookingCard({ booking, onView, onCancel, onReschedule, onRebook }) {
  const isCancelled = booking.status === 'CANCELLED';
  const isCompleted = booking.status === 'COMPLETED';

  return (
    <article className={`neu-card p-6 md:p-8 transition-all ${isCancelled ? 'opacity-75 grayscale-[30%]' : ''}`} aria-labelledby={`booking-title-${booking._id}`}>
      <div className="flex flex-col md:flex-row gap-6 justify-between">
        
        <div className="flex-1 space-y-4 border-b md:border-b-0 md:border-r border-neu-dark/20 pb-4 md:pb-0 md:pr-6">
          <div className="flex justify-between items-start">
             <div>
               <h3 id={`booking-title-${booking._id}`} className="text-xl font-extrabold text-gray-800 drop-shadow-sm">
                 {booking.hospital?.name || booking.hospitalName}
               </h3>
               <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider flex items-center gap-2">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                 {booking.hospital?.city || 'Location Details Available'}
               </p>
             </div>
             <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-neu-flat ${
                isCompleted ? 'bg-accent-green/20 text-accent-green' : 
                isCancelled ? 'bg-red-100 text-red-600' : 
                'bg-brand-100 text-brand-700'
             }`}>
               {booking.status}
             </span>
          </div>

          <div className="flex gap-4 p-4 neu-inset-sm rounded-neu bg-neu-bg">
             <div className="flex-1">
                <p className="neu-label">Vaccine</p>
                <p className="font-bold text-gray-800">{booking.vaccine?.name || booking.vaccineName}</p>
                <p className="text-xs text-gray-500">Dose: {booking.doseNumber}</p>
             </div>
             <div className="w-px bg-neu-dark/30"></div>
             <div className="flex-1 text-right">
                <p className="neu-label">Date</p>
                <p className="font-bold text-gray-800">{new Date(booking.slotDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric'})}</p>
             </div>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end justify-between shrink-0 w-full md:w-56 gap-4 text-center md:text-right">
          <div>
            <p className="neu-label">Cost</p>
            <p className="text-3xl font-extrabold text-brand-600 drop-shadow-sm">₹{booking.finalPrice}</p>
            <p className="text-[10px] text-gray-400 font-mono mt-1">REF: {booking.bookingReference}</p>
          </div>

          <div className="flex flex-wrap md:flex-col justify-end gap-3 w-full">
            <button
              onClick={() => onView(booking)}
              className="neu-btn-ghost px-4 py-2 flex-grow text-xs truncate"
              aria-label={`View booking details for ${booking.hospital?.name}`}
            >
              Details
            </button>
            <button
               onClick={() => onRebook(booking)}
               className="neu-btn px-4 py-2 flex-grow text-xs bg-brand-100 text-brand-700 font-bold truncate"
               title="Book same vaccine at this hospital again"
            >
              Book Again
            </button>
            {!isCancelled && !isCompleted && (
              <div className="flex gap-2 w-full justify-end mt-2 pt-2 border-t border-neu-dark/20">
                <button
                  onClick={() => onReschedule(booking)}
                  className="neu-btn-primary px-3 py-2 text-xs flex-1"
                >
                  Change Date
                </button>
                <button
                  onClick={() => onCancel(booking)}
                  className="neu-btn-danger px-3 py-2 text-xs flex-1"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
