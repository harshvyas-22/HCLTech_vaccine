import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-neu-lg text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'neu-inset text-brand-600'
        : 'text-gray-600 hover:text-brand-600 hover:neu-card-sm'
    }`;

  return (
    <header className="neu-card mx-4 mt-4 lg:mx-8 md:mt-6 mb-8 px-4 py-4 sm:px-6 lg:px-8 z-40 sticky top-4" role="banner">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="text-2xl font-bold flex items-center gap-3 text-brand-700" aria-label="VaxBook Home">
          <svg className="w-8 h-8 text-brand-600 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
          </svg>
          <span style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.8), -1px -1px 2px rgba(184,190,199,0.4)' }}>VaxBook</span>
        </Link>
        <nav className="hidden gap-2 md:flex items-center" aria-label="Main Navigation">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          {user && user.role === 'admin' ? (
            <>
              <NavLink to="/admin" className={navLinkClass}>
                Admin Dash
              </NavLink>
              <NavLink to="/admin/hospitals" className={navLinkClass}>
                Hospitals
              </NavLink>
              <NavLink to="/admin/vaccines" className={navLinkClass}>
                Vaccines
              </NavLink>
              <NavLink to="/admin/slots" className={navLinkClass}>
                Slots
              </NavLink>
              <NavLink to="/admin/bookings" className={navLinkClass}>
                Bookings
              </NavLink>
            </>
          ) : user ? (
            <NavLink to="/bookings" className={navLinkClass}>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                My Bookings
              </span>
            </NavLink>
          ) : null}
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden neu-inset px-4 py-2 text-sm text-gray-700 font-medium md:flex items-center gap-2 rounded-full" aria-label="Current User">
                <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="neu-btn-danger px-5 py-2 !rounded-full text-sm"
                aria-label="Logout"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                  Logout
                </span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="px-5 py-2 neu-card-sm hover:neu-inset transition-all text-sm font-semibold text-gray-700 rounded-full">
                Login
              </Link>
              <Link
                to="/register"
                className="neu-btn-primary px-5 py-2 !rounded-full text-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
