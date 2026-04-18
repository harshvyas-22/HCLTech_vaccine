export default function SlotCalendar({ availability = [], selectedDate, onDateChange }) {
  // Map backend dailySlots array to an easier lookup object
  const slotMap = Array.isArray(availability) 
    ? availability.reduce((acc, slot) => {
        const dateKey = new Date(slot.date).toISOString().split('T')[0];
        acc[dateKey] = (slot.total || 0) - (slot.booked || 0);
        return acc;
      }, {})
    : {};

  const availableSlotsCount = slotMap[selectedDate] ?? 0;
  
  return (
    <div className="neu-card p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-8 border-b border-neu-dark/20 pb-6">
         <div>
           <h2 className="text-xl font-bold flex items-center gap-3 text-brand-700">
             <div className="w-10 h-10 rounded-full neu-inset-sm flex justify-center items-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
             </div>
             Schedule Dose
           </h2>
           <p className="text-gray-500 mt-2 font-medium">Pick a date to check availability.</p>
         </div>
         
         {/* Live Status indicator */}
         {selectedDate && (
           <div className={`neu-inset px-5 py-3 rounded-xl flex items-center gap-3 ${availableSlotsCount > 0 ? 'bg-accent-green/5' : 'bg-red-500/5'}`}>
             <div className="flex flex-col">
               <span className="neu-label !mb-0 text-right">Available Slots</span>
               <span className={`text-2xl font-extrabold text-right drop-shadow-sm ${availableSlotsCount > 0 ? 'text-accent-green' : 'text-red-500'}`}>
                  {availableSlotsCount > 0 ? availableSlotsCount : 'Full'}
               </span>
             </div>
           </div>
         )}
      </div>
      
      <div>
        <label htmlFor="bookingDate" className="neu-label">Select Date</label>
        <input
          type="date"
          id="bookingDate"
          value={selectedDate || ''}
          onChange={(e) => onDateChange(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="neu-input h-14 text-lg font-bold text-brand-800"
          aria-label="Select booking date"
        />
      </div>

    </div>
  );
}
