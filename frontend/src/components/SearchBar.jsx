import { useState } from 'react';

export default function SearchBar({ value, onChange, onSubmit }) {
  const [query, setQuery] = useState(value || '');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end w-full" role="search">
      <div className="flex-1 w-full">
        <label htmlFor="searchQuery" className="neu-label">Search Location</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            id="searchQuery"
            value={query}
            onChange={(e) => {
               setQuery(e.target.value);
               onChange(e.target.value); // dynamic update 
            }}
            placeholder="e.g., Mumbai, 400001, City Hospital"
            className="neu-input pl-12"
            aria-label="Search hospitals by city, pincode, or name"
          />
        </div>
      </div>
      <button
        type="submit"
        className="neu-btn-primary h-[52px]"
        aria-label="Submit search"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        Search
      </button>
    </form>
  );
}
