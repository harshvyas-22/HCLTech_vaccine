export default function FilterPanel({ filters, vaccines, onChange }) {
  return (
    <div className="neu-card p-6 md:p-8 space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-brand-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
          Refine Results
        </h2>
        {(filters.vaccineId || filters.date || filters.minPrice !== '' || filters.maxPrice !== '') && (
          <button 
            type="button"
            onClick={() => onChange({ vaccineId: '', date: '', minPrice: '', maxPrice: '' })}
            className="text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-full transition-colors"
          >
            Clear Filters ×
          </button>
        )}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <label htmlFor="vaccineFilter" className="neu-label">Vaccine Type</label>
          <select
            id="vaccineFilter"
            value={filters.vaccineId || ''}
            onChange={(e) => onChange({ vaccineId: e.target.value })}
            className="neu-select"
            aria-label="Filter by vaccine type"
          >
            <option value="">All Vaccines</option>
            {vaccines.map((vaccine) => (
              <option key={vaccine._id || vaccine.id} value={vaccine._id || vaccine.id}>
                {vaccine.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="dateFilter" className="neu-label">Availability Date</label>
          <input
            id="dateFilter"
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={filters.date || ''}
            onChange={(e) => onChange({ date: e.target.value })}
            className="neu-input"
            aria-label="Filter by date"
          />
        </div>
        <div>
          <label className="neu-label">Price Range (₹)</label>
          <div className="relative">
            <select
              id="priceFilter"
              className="neu-select text-gray-800"
              aria-label="Filter by price range"
              value={`${filters.minPrice || ''}-${filters.maxPrice || ''}`}
              onChange={(e) => {
                const [min, max] = e.target.value.split('-');
                onChange({ minPrice: min || '', maxPrice: max || '' });
              }}
            >
              <option value="-">Any Price</option>
              <option value="0-0">Free / Government run</option>
              <option value="1-500">Under ₹500</option>
              <option value="500-1500">₹500 - ₹1500</option>
              <option value="1500-">Over ₹1500</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
