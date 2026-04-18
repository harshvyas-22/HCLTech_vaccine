import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import LoadingSpinner from '../components/LoadingSpinner';
import SlotCalendar from '../components/SlotCalendar';
import { useBooking } from '../context/BookingContext';

export default function HospitalDetailPage() {
  const { id } = useParams();
  const [hospital, setHospital] = useState(null);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { selectBooking } = useBooking();

  useEffect(() => {
    const fetchHospital = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/hospitals/${id}`);
        // match response shape properly
        const fetched = response.data.data?.hospital || response.data.hospital; 
        setHospital(fetched);
        
        if (fetched.vaccines?.length > 0) {
           setSelectedVaccine(fetched.vaccines[0]);
        }
      } catch (err) {
        setError('Unable to load hospital details. Please check connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchHospital();
  }, [id]);

  // Pass active dailySlots array directly down to SlotCalendar
  const availability = useMemo(() => selectedVaccine?.dailySlots || [], [selectedVaccine]);

  const handleBook = () => {
    if (!selectedVaccine || !selectedDate) {
      setError('Please choose a vaccine offering and an available date to continue.');
      return;
    }
    
    // Safety check that slots actually exist on date
    const theSlot = availability.find(s => new Date(s.date).toISOString().split('T')[0] === selectedDate);
    if (!theSlot || (theSlot.total - (theSlot.booked||0)) <= 0) {
        setError('Selected date has no available slots. Choose a different date.');
        return;
    }

    selectBooking({ 
      hospital, 
      vaccine: selectedVaccine.vaccineId, // pass raw nested object for reference
      vaccineId: selectedVaccine.vaccineId._id || selectedVaccine.vaccineId, 
      price: selectedVaccine.price, 
      slotDate: selectedDate 
    });
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <LoadingSpinner size="h-20 w-20" />
      </div>
    );
  }

  if (!hospital) {
    return (
       <div className="neu-card p-12 text-center max-w-lg mx-auto mt-12 bg-neu-bg">
          <div className="w-20 h-20 rounded-full neu-inset-sm flex items-center justify-center text-red-500 mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <p className="text-xl font-bold text-gray-800">Hospital Not Found</p>
          <button onClick={() => navigate(-1)} className="mt-8 neu-btn-ghost px-8">Go Back</button>
       </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl animate-fade-in space-y-10 pb-12">
      {/* Header Info Block */}
      <section className="neu-card p-8 md:p-10 lg:p-12">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr] items-start">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neu-dark/20 pb-6">
              <div>
                <h1 className="text-4xl font-extrabold text-gray-800 drop-shadow-sm tracking-tight">{hospital.name}</h1>
                <p className="text-lg text-gray-500 font-medium mt-2 flex items-start gap-2">
                   <svg className="w-6 h-6 text-brand-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                   {hospital.address}, {hospital.city} {hospital.state} - {hospital.pincode}
                </p>
              </div>
              <span className="neu-badge text-brand-700 self-start sm:self-center" style={{fontSize: '14px', padding: '8px 16px', background: "rgba(255,255,255,0.4)"}}>
                ★ Premium Facility
              </span>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="neu-inset-sm p-5 rounded-neu bg-neu-bg">
                <p className="neu-label">Emergency Contact</p>
                <div className="mt-2 flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full neu-card-sm flex items-center justify-center text-brand-600 bg-brand-50 border border-white/60">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                   </div>
                   <p className="text-gray-900 font-bold">{hospital.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="neu-inset-sm p-5 rounded-neu bg-neu-bg">
                <p className="neu-label">Operating Hours</p>
                <div className="mt-2 flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full neu-card-sm flex items-center justify-center text-brand-600 bg-brand-50 border border-white/60">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                   </div>
                   <div>
                     <p className="text-gray-900 font-bold">{hospital.operatingHours?.open || '9:00 AM'}</p>
                     <p className="text-[11px] text-gray-500 font-bold uppercase">To {hospital.operatingHours?.close || '8:00 PM'}</p>
                   </div>
                </div>
              </div>
              <div className="neu-inset-sm p-5 rounded-neu bg-neu-bg">
                <p className="neu-label">Email Enquiry</p>
                <div className="mt-2 flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full neu-card-sm flex items-center justify-center text-brand-600 bg-brand-50 border border-white/60">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                   </div>
                   <a href={`mailto:${hospital.email}`} className="text-brand-600 font-bold hover:underline truncate w-full" title={hospital.email}>{hospital.email || 'N/A'}</a>
                </div>
              </div>
            </div>
          </div>

          <div className="h-full bg-neu-bg neu-inset p-6 sm:p-8 rounded-neu-lg">
            <p className="neu-label mb-4">Key Facilities</p>
            <ul className="grid grid-cols-1 gap-3">
              {(hospital.facilities?.length > 0 ? hospital.facilities : ['Emergency care', 'Air Conditioned', 'Free WiFi', 'Pharmacy 24x7', 'Wheelchair Access']).slice(0, 5).map((facility, index) => (
                <li key={index} className="flex items-center gap-3 bg-white/40 px-4 py-3 rounded-lg shadow-sm border border-white/60 text-gray-800 font-medium">
                   <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                   {facility}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Main Action Block - interactive area */}
      <section className="grid gap-10 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-10">
          
          <div className="neu-card p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
               <div className="w-10 h-10 rounded-full neu-inset-sm flex center justify-center text-brand-600 items-center">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
               </div>
               Select Vaccine
            </h2>
            
            <div className="grid gap-4">
              {hospital.vaccines?.length > 0 ? hospital.vaccines.map((offering) => {
                const vac = offering.vaccineId;
                const isSelected = selectedVaccine?.vaccineId?._id === vac?._id;
                return (
                  <button
                    key={vac?._id || offering._id}
                    type="button"
                    onClick={() => { setSelectedVaccine(offering); setSelectedDate(''); }}
                    className={`w-full rounded-neu p-5 text-left transition-all duration-200 border-2 ${
                      isSelected 
                        ? 'border-brand-500 neu-inset bg-brand-50/50' 
                        : 'border-transparent neu-card-sm hover:neu-card hover:-translate-y-0.5'
                    }`}
                    aria-pressed={isSelected}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                           <p className="text-xl font-extrabold text-gray-800">{vac?.name}</p>
                           {isSelected && <span className="neu-badge bg-brand-500 text-white shadow-none">Selected</span>}
                        </div>
                        <p className="text-sm font-medium text-gray-500">Mfr: {vac?.manufacturer || 'Standard'}</p>
                      </div>
                      <div className="sm:text-right shrink-0">
                         <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Price / Dose</p>
                         <p className="text-2xl font-black text-brand-600 drop-shadow-sm">₹{offering.price}</p>
                      </div>
                    </div>
                  </button>
                );
              }) : (
                 <div className="neu-inset rounded-neu p-8 text-center text-gray-500 font-bold bg-neu-bg">
                    No vaccines currently offered by this hospital.
                 </div>
              )}
            </div>
          </div>

          <SlotCalendar availability={availability} selectedDate={selectedDate} onDateChange={setSelectedDate} />

        </div>

        <aside className="sticky top-28 h-fit space-y-6">
          <div className="neu-card p-8 bg-gradient-to-br from-neu-bg to-brand-50/30">
            <h2 className="mb-6 text-xl font-extrabold text-gray-800 drop-shadow-sm border-b border-neu-dark/20 pb-4">Booking Summary</h2>
            
            <div className="space-y-6">
               <div>
                  <p className="neu-label">Selected Vaccine</p>
                  {selectedVaccine ? (
                     <div className="mt-2 bg-white/40 p-3 rounded-lg border border-white/60 shadow-sm">
                        <p className="text-lg font-bold text-gray-800">{selectedVaccine.vaccineId?.name}</p>
                        <p className="text-sm font-bold text-brand-600">₹{selectedVaccine.price}</p>
                     </div>
                  ) : (
                     <p className="mt-2 text-sm text-gray-400 font-bold bg-neu-inset p-3 rounded-md">Pending selection...</p>
                  )}
               </div>

               <div>
                  <p className="neu-label">Selected Date</p>
                  {selectedDate ? (
                     <div className="mt-2 bg-white/40 p-3 rounded-lg border border-white/60 shadow-sm">
                        <p className="text-lg font-bold text-gray-800">
                          {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                     </div>
                  ) : (
                     <p className="mt-2 text-sm text-gray-400 font-bold bg-neu-inset p-3 rounded-md">Pick a slot in calendar</p>
                  )}
               </div>
            </div>

            {error && (
              <div className="mt-8 bg-red-100 p-4 rounded-xl shadow-neu-inset-sm border border-red-200">
                <p className="text-sm font-bold text-red-600 flex items-start gap-2">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {error}
                </p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-neu-dark/20">
               <button
                 type="button"
                 onClick={handleBook}
                 disabled={!selectedVaccine || !selectedDate}
                 className="neu-btn-primary w-full py-4 text-base tracking-widest uppercase shadow-[6px_6px_14px_rgba(31,95,111,0.4),_-6px_-6px_14px_rgba(255,255,255,0.7)]"
               >
                 Proceed to Checkout
               </button>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
