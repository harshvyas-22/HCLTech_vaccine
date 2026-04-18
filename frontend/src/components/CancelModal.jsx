export default function CancelModal({ isOpen, booking, onCancel, onClose }) {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay bg-black/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="cancel-title">
      <div className="w-full max-w-md rounded-neu-lg bg-neu-bg p-8 shadow-[10px_10px_30px_rgba(0,0,0,0.5),_inset_1px_1px_0_rgba(255,255,255,0.5)] modal-content relative overflow-hidden">
        
        {/* Warning accent bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 to-red-600"></div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full neu-inset-sm flex items-center justify-center bg-red-100 text-red-500">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h2 id="cancel-title" className="text-2xl font-bold text-gray-800">Cancel Booking</h2>
        </div>
        
        <p className="text-gray-600 mb-6 font-medium leading-relaxed">
          Are you sure you want to cancel your upcoming appointment for <strong className="text-gray-800 bg-white/50 px-1 rounded">{booking.vaccine?.name || booking.vaccineName}</strong> at <strong className="text-gray-800">{booking.hospital?.name || booking.hospitalName}</strong>?
        </p>
        
        <div className="bg-neu-bg neu-inset p-5 rounded-neu mb-8">
          <label htmlFor="cancelReason" className="neu-label pl-1">Reason (Optional)</label>
          <textarea 
            id="cancelReason" 
            rows="3" 
            className="neu-input w-full bg-transparent border-none focus:ring-0 px-1 resize-none" 
            placeholder="Let us know why you're cancelling..." 
          />
        </div>
        
        <div className="flex flex-col-reverse sm:flex-row gap-4 sm:justify-end border-t border-neu-dark/20 pt-6">
          <button type="button" onClick={onClose} className="neu-btn-ghost px-6 w-full sm:w-auto text-gray-600 font-bold">
            Keep Appointment
          </button>
          <button 
             type="button" 
             onClick={() => {
                const reason = document.getElementById('cancelReason')?.value;
                onCancel({ ...booking, reason });
             }} 
             className="neu-btn-danger px-6 w-full sm:w-auto shadow-md"
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
