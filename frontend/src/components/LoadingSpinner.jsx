export default function LoadingSpinner({ size = 'h-16 w-16' }) {
  return (
    <div className={`flex items-center justify-center ${size}`} role="status" aria-label="Loading">
      <div className="relative flex items-center justify-center w-full h-full">
        {/* Embossed outer ring */}
        <div className="absolute inset-0 rounded-full shadow-neu-flat"></div>
        {/* Inner track */}
        <div className="absolute inset-2 rounded-full shadow-neu-inset bg-neu-bg"></div>
        {/* Spinning indicator */}
        <div className="absolute inset-0 rounded-full border-b-4 border-l-4 border-brand-500 animate-spin"></div>
        {/* Central dot */}
        <div className="absolute w-3 h-3 rounded-full bg-brand-600 shadow-sm animate-pulse-soft"></div>
      </div>
      <span className="sr-only">Loading content...</span>
    </div>
  );
}
