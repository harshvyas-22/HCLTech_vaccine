import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import HospitalCard from '../components/HospitalCard';
import HospitalMap from '../components/HospitalMap';
import LoadingSpinner from '../components/LoadingSpinner';
import { useBooking } from '../context/BookingContext';

export default function HomePage() {
  const [hospitals, setHospitals] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ vaccineId: '', date: '', minPrice: '', maxPrice: '' });
  const [view, setView] = useState('list');
  const { selectBooking } = useBooking();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [hospitalResponse, vaccineResponse] = await Promise.all([
          api.get('/hospitals/search'), // Fixed mismatch: GET /hospitals/search
          api.get('/vaccines'),
        ]);
        setHospitals(hospitalResponse.data.data?.hospitals || hospitalResponse.data.hospitals || []);
        setVaccines(vaccineResponse.data.data?.vaccines || vaccineResponse.data.vaccines || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((hospital) => {
      const matchesQuery = searchQuery
        ? [hospital.name, hospital.city, hospital.address, hospital.pincode]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      // All vaccine-specific filters must match the SAME vaccine to be valid
      const hasValidVaccine = hospital.vaccines?.some((v) => {
        const matchesVaccine = filters.vaccineId ? (v.vaccineId?._id || v.vaccineId) === filters.vaccineId : true;
        const matchesDate = filters.date
          ? v.dailySlots?.some(
              (slot) => {
                // slot.date is an ISO string "2026-04-18T00:00:00.000Z"
                const localDateObj = new Date(slot.date);
                // get local offset date to prevent midnight UTC shift
                const shifted = new Date(localDateObj.getTime() - localDateObj.getTimezoneOffset() * 60000);
                return shifted.toISOString().split('T')[0] === filters.date && (slot.total - slot.booked) > 0;
              }
            )
          : true;
        
        // Handle potentially 0 values or empty strings
        const minVal = filters.minPrice !== '' ? Number(filters.minPrice) : null;
        const maxVal = filters.maxPrice !== '' ? Number(filters.maxPrice) : null;
        
        const matchesMin = minVal !== null ? v.price >= minVal : true;
        const matchesMax = maxVal !== null ? v.price <= maxVal : true;

        return matchesVaccine && matchesDate && matchesMin && matchesMax;
      });

      // If NO vaccine matches the filter, hide the hospital
      // (Unless hospital has 0 vaccines but filters are completely empty, though you may want to hide them anyway)
      const isVaccineMatch = (!filters.vaccineId && !filters.date && filters.minPrice === '' && filters.maxPrice === '') 
        ? true 
        : hasValidVaccine;

      return matchesQuery && isVaccineMatch;
    });
  }, [hospitals, filters, searchQuery]);

  const handleQuickBook = (hospital) => {
    const firstVaccine = hospital.vaccines?.[0] || null;
    selectBooking({ 
      hospital, 
      vaccine: firstVaccine?.vaccineId || null, 
      vaccineId: firstVaccine?.vaccineId?._id || firstVaccine?.vaccineId,
      price: firstVaccine?.price || 0, 
      slotDate: filters.date || '' 
    });
    navigate(`/hospital/${hospital._id || hospital.id}`);
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <LoadingSpinner size="h-20 w-20" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl animate-fade-in space-y-12 pb-12">
      {/* Hero Section */}
      <section className="neu-card p-8 md:p-14 relative overflow-hidden flex flex-col items-center text-center">
        {/* Subtle background decoration */}
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 rounded-full bg-brand-200/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 rounded-full bg-brand-400/20 blur-3xl pointer-events-none"></div>
        
        <div className="max-w-3xl z-10 space-y-6 flex flex-col items-center">
          <p className="neu-badge text-brand-600 bg-brand-50 border border-brand-200 uppercase tracking-widest shadow-none">
            Health made simple
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 tracking-tight drop-shadow-sm leading-tight">
            Find & Book Vaccines Near You
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl px-4">
            Search top-rated hospitals, compare offering prices, and reserve your time slot in seconds.
          </p>
          
          <div className="w-full max-w-3xl mt-8 p-6 md:p-8 neu-inset bg-neu-bg rounded-neu-xl">
             <SearchBar value={searchQuery} onChange={setSearchQuery} onSubmit={setSearchQuery} />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="grid gap-8 xl:grid-cols-[380px_1fr]">
        <aside className="space-y-8">
          <FilterPanel filters={filters} vaccines={vaccines} onChange={(update) => setFilters((prev) => ({ ...prev, ...update }))} />
          
          <div className="neu-card p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 text-brand-700 flex items-center gap-2">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
               View Mode
            </h2>
            <div className="flex bg-neu-bg neu-inset p-2 rounded-neu">
              {['list', 'map'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setView(option)}
                  className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${
                    view === option 
                    ? 'neu-btn-primary drop-shadow' 
                    : 'text-gray-500 hover:text-gray-800 hover:bg-white/40'}`}
                >
                  {option} View
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neu-bg neu-card-sm px-6 py-4">
            <div>
              <p className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-1">Results</p>
              <h2 className="text-2xl font-black text-gray-800 drop-shadow-sm">{filteredHospitals.length} Hospitals Found</h2>
            </div>
            {searchQuery && (
              <div className="neu-inset px-4 py-2 rounded-full text-sm font-medium text-brand-700 border border-brand-200/50">
                 "{searchQuery}"
                 <button onClick={() => setSearchQuery('')} className="ml-2 hover:text-red-500 transition-colors" aria-label="Clear search">×</button>
              </div>
            )}
          </div>

          <div className="min-h-[500px]">
             {view === 'map' ? (
               <HospitalMap hospitals={filteredHospitals} onSelect={(hospital) => navigate(`/hospital/${hospital._id || hospital.id}`)} />
             ) : (
               <div className="grid gap-8">
                 {filteredHospitals.length > 0 ? (
                   filteredHospitals.map((hospital) => (
                     <HospitalCard key={hospital._id || hospital.id} hospital={hospital} onSelect={handleQuickBook} />
                   ))
                 ) : (
                   <div className="neu-card p-16 text-center flex flex-col items-center justify-center">
                     <div className="w-20 h-20 rounded-full neu-inset-sm flex items-center justify-center text-gray-400 mb-6">
                       <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                     </div>
                     <h3 className="text-xl font-bold text-gray-800 mb-2">No hospitals found</h3>
                     <p className="text-gray-500 font-medium">We couldn't find any hospitals matching your criteria. Try adjusting the filters or searching a different area.</p>
                     <button onClick={() => { setSearchQuery(''); setFilters({ vaccineId: '', date: '', minPrice: '', maxPrice: '' }); }} className="mt-8 neu-btn-primary px-8">
                       Clear all filters
                     </button>
                   </div>
                 )}
               </div>
             )}
          </div>
        </div>
      </section>
    </div>
  );
}
