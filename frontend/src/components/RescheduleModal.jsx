import { useState } from 'react';

export default function RescheduleModal({ isOpen, booking, onReschedule, onClose }) {
  const [date, setDate] = useState(booking?.slotDate ? new Date(booking.slotDate).toISOString().split('T')[0] : '');
  
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay bg-black/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="reschedule-title">
      <div className="w-full max-w-md rounded-neu-lg bg-neu-bg p-8 shadow-[10px_10px_30px_rgba(0,0,0,0.5),_inset_1px_1px_0_rgba(255,255,255,0.5)] modal-content relative overflow-hidden">
        
        {/* Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-500 to-brand-600"></div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full neu-inset-sm flex items-center justify-center bg-brand-100 text-brand-600">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
          <h2 id="reschedule-title" className="text-2xl font-bold text-gray-800">Reschedule Dose</h2>
        </div>
        
        <p className="text-gray-600 mb-6 font-medium leading-relaxed">
          Select a new date for your <strong>{booking.vaccine?.name}</strong> appointment at <strong>{booking.hospital?.name}</strong>.
        </p>
        
        <div className="mb-8">
          <label htmlFor="rescheduleDate" className="neu-label">New Appointment Date</label>
          <input
            type="date"
            id="rescheduleDate"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="neu-input"
            aria-required="true"
          />
        </div>
        
        <div className="flex flex-col-reverse sm:flex-row gap-4 sm:justify-end border-t border-neu-dark/20 pt-6">
          <button type="button" onClick={onClose} className="neu-btn-ghost px-6 w-full sm:w-auto font-bold text-gray-600">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onReschedule(booking, date)}
            className="neu-btn-primary px-6 w-full sm:w-auto shadow-md"
            disabled={!date}
          >
            Update Date
          </button>
        </div>
      </div>
    </div>
  );
}
