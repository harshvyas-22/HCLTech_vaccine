import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const onSubmit = async (data) => {
    await login(data);
    navigate(from, { replace: true });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center animate-fade-in py-12">
      <div className="neu-card p-8 md:p-12 w-full max-w-md relative overflow-hidden">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-500 to-brand-600"></div>
        
        <div className="flex flex-col items-center mb-10 text-center">
           <div className="w-16 h-16 rounded-full neu-inset-sm flex items-center justify-center bg-brand-50 text-brand-600 mb-4 border border-white/40">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
           </div>
           <h1 className="text-3xl font-extrabold text-gray-800 drop-shadow-sm tracking-tight mb-2">Welcome Back</h1>
           <p className="text-gray-500 font-medium">Login to manage your vaccine bookings</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="neu-label ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                 <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className={`neu-input pl-12 ${errors.email ? 'border-2 border-red-500' : ''}`}
                placeholder="your@email.com"
                aria-invalid={errors.email ? "true" : "false"}
              />
            </div>
            {errors.email && <p className="mt-2 text-xs font-bold text-red-500 ml-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="neu-label ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                 <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                className={`neu-input pl-12 ${errors.password ? 'border-2 border-red-500' : ''}`}
                placeholder="••••••••"
                aria-invalid={errors.password ? "true" : "false"}
              />
            </div>
            {errors.password && <p className="mt-2 text-xs font-bold text-red-500 ml-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="neu-btn-primary w-full py-4 text-base tracking-wide mt-2"
          >
            {loading ? <LoadingSpinner size="h-6 w-6" /> : 'Sign In'}
          </button>
        </form>

        <p className="mt-10 text-center text-sm font-medium text-gray-500 pt-6 border-t border-neu-dark/20">
          Don't have an account?{' '}
          <Link to="/register" className="font-extrabold text-brand-600 hover:text-brand-800 hover:underline px-2 py-1 rounded-md transition hover:bg-brand-50">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
