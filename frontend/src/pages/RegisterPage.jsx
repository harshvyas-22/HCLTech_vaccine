import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function RegisterPage() {
  const { register: registerUser, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password', '');

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const onSubmit = async (data) => {
    await registerUser(data);
    navigate(from, { replace: true });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center animate-fade-in py-12">
      <div className="neu-card p-8 md:p-12 w-full max-w-xl relative overflow-hidden">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-500 to-brand-600"></div>

        <div className="flex flex-col items-center mb-10 text-center">
           <div className="w-16 h-16 rounded-full neu-inset-sm flex items-center justify-center bg-brand-50 text-brand-600 mb-4 border border-white/40">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
           </div>
           <h1 className="text-3xl font-extrabold text-gray-800 drop-shadow-sm tracking-tight mb-2">Create Account</h1>
           <p className="text-gray-500 font-medium">Register to securely book and manage your vaccinations</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div>
            <label className="neu-label ml-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <input
                {...register('name', { required: 'Name is required' })}
                className={`neu-input pl-12 ${errors.name ? 'border-2 border-red-500' : ''}`}
                placeholder="John Doe"
              />
            </div>
            {errors.name && <p className="mt-2 text-xs font-bold text-red-500 ml-1">{errors.name.message}</p>}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="neu-label ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className={`neu-input pl-12 ${errors.email ? 'border-2 border-red-500' : ''}`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && <p className="mt-2 text-xs font-bold text-red-500 ml-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="neu-label ml-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                <input
                  {...register('phone', { required: 'Phone number is required' })}
                  className={`neu-input pl-12 ${errors.phone ? 'border-2 border-red-500' : ''}`}
                  placeholder="+91 9876543210"
                />
              </div>
              {errors.phone && <p className="mt-2 text-xs font-bold text-red-500 ml-1">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <label className="neu-label ml-1">Date of Birth</label>
            <div className="relative">
               <input
                 type="date"
                 {...register('dateOfBirth', { required: 'Date of birth is required' })}
                 className={`neu-input ${errors.dateOfBirth ? 'border-2 border-red-500' : ''}`}
               />
            </div>
            {errors.dateOfBirth && <p className="mt-2 text-xs font-bold text-red-500 ml-1">{errors.dateOfBirth.message}</p>}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="neu-label ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <input
                  type="password"
                  {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min. 8 chars' } })}
                  className={`neu-input pl-12 ${errors.password ? 'border-2 border-red-500' : ''}`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-2 text-xs font-bold text-red-500 ml-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="neu-label ml-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <input
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Please confirm password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                  className={`neu-input pl-12 ${errors.confirmPassword ? 'border-2 border-red-500' : ''}`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <p className="mt-2 text-xs font-bold text-red-500 ml-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="neu-btn-primary w-full py-4 text-base tracking-wide mt-4"
          >
            {loading ? <LoadingSpinner size="h-6 w-6" /> : 'Register Account'}
          </button>
        </form>

        <p className="mt-10 text-center text-sm font-medium text-gray-500 pt-6 border-t border-neu-dark/20">
          Already have an account?{' '}
          <Link to="/login" className="font-extrabold text-brand-600 hover:text-brand-800 hover:underline px-2 py-1 rounded-md transition hover:bg-brand-50">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
