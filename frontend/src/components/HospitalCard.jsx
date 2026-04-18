import { Link } from 'react-router-dom';

export default function HospitalCard({ hospital, onSelect }) {
  const availableVaccinesCount = hospital.vaccines?.length || 0;
  const startingPrice = hospital.vaccines?.reduce((min, item) => Math.min(min, item.price), Number.POSITIVE_INFINITY);

  return (
    <article className="neu-card p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between transform transition duration-300 hover:scale-[1.01]" aria-labelledby={`hospital-title-${hospital._id}`}>
      <div className="space-y-4 flex-1">
        <div className="flex flex-wrap gap-3 items-center">
           <h3 id={`hospital-title-${hospital._id}`} className="text-2xl font-bold text-gray-800 tracking-tight">
             {hospital.name}
           </h3>
           {availableVaccinesCount > 0 ? (
             <span className="neu-badge text-accent-green" title="Slots open">
               <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse-soft"></span>
               Available
             </span>
           ) : (
             <span className="neu-badge text-accent-amber" title="Check back later">
               <span className="w-2 h-2 rounded-full bg-accent-amber"></span>
               No Slots
             </span>
           )}
        </div>
        
        <div className="flex items-start gap-2 text-gray-600">
           <svg className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
           <p className="text-sm font-medium">{hospital.address}, {hospital.city} {hospital.pincode}</p>
        </div>

        <div className="neu-inset-sm p-4 rounded-neu space-y-2 mt-4 inline-block">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Offerings</p>
          <div className="flex flex-wrap gap-2">
            {hospital.vaccines?.slice(0, 3).map((v) => (
               <span key={v.vaccineId?._id || v.vaccineId} className="px-3 py-1 bg-neu-bg rounded-md text-xs font-semibold text-brand-700 shadow-[2px_2px_4px_#b8bec7,-2px_-2px_4px_#ffffff]">
                 {v.vaccineId?.name || 'Vaccine'} - ₹{v.price}
               </span>
            ))}
            {availableVaccinesCount > 3 && (
               <span className="px-3 py-1 bg-neu-bg border border-neu-dark/20 rounded-md text-xs font-bold text-gray-500 shadow-[2px_2px_4px_#b8bec7,-2px_-2px_4px_#ffffff]">
                 +{availableVaccinesCount - 3} more
               </span>
            )}
            {availableVaccinesCount === 0 && (
              <span className="text-sm text-gray-500 font-medium">Coming soon</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 md:border-l border-neu-dark/20 pt-4 md:pt-0 md:pl-6 shrink-0 md:w-48 text-right">
        <div className="text-left md:text-right w-full">
          <p className="neu-label !mb-1">Starting From</p>
          <p className="text-3xl font-extrabold text-brand-600 drop-shadow-sm">
            {Number.isFinite(startingPrice) ? `₹${startingPrice}` : 'N/A'}
          </p>
        </div>
        
        <div className="flex flex-col gap-3 w-full">
          <Link
            to={`/hospital/${hospital._id || hospital.id}`}
            className="neu-btn-primary w-full text-center py-3"
            aria-label={`View details for ${hospital.name}`}
          >
            View Details
          </Link>
          <button
            type="button"
            onClick={() => onSelect?.(hospital)}
            disabled={availableVaccinesCount === 0}
            className="neu-btn-ghost w-full py-3 text-sm flex justify-center items-center gap-2"
            aria-label={`Quick book at ${hospital.name}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            Quick Book
          </button>
        </div>
      </div>
    </article>
  );
}
