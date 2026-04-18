import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axiosConfig';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

export default function AdminHospitalsPage() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await api.get('/hospitals/search');
      setHospitals(response.data.data?.hospitals || []);
    } catch (error) {
       toast.error('Failed to load hospitals');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      location: { coordinates: [Number(data.lng), Number(data.lat)] },
      operatingHours: { open: data.openTime, close: data.closeTime },
    };
    try {
      await api.post('/hospitals', payload);
      toast.success('Hospital added successfully');
      reset();
      setIsAdding(false);
      fetchHospitals();
    } catch (error) {
      toast.error('Failed to add hospital');
    }
  };

  const deleteHospital = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/hospitals/${id}`);
      toast.success('Hospital deleted');
      fetchHospitals();
    } catch (error) {
      toast.error('Failed to delete hospital');
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="mx-auto max-w-7xl animate-fade-in space-y-10 pb-12">
      <header className="flex justify-between items-center neu-card p-8">
        <div>
           <h1 className="text-3xl font-black text-gray-800 tracking-tight drop-shadow-sm">Hospitals Management</h1>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="neu-btn-primary">
          {isAdding ? 'Cancel' : '+ Add Hospital'}
        </button>
      </header>

      {isAdding && (
        <div className="neu-inset rounded-neu-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
            <div><label className="neu-label">Name</label><input {...register('name', { required: true })} className="neu-input" /></div>
            <div><label className="neu-label">Address</label><input {...register('address', { required: true })} className="neu-input" /></div>
            <div><label className="neu-label">City</label><input {...register('city', { required: true })} className="neu-input" /></div>
            <div><label className="neu-label">State</label><input {...register('state', { required: true })} className="neu-input" /></div>
            <div><label className="neu-label">Pincode</label><input {...register('pincode', { required: true })} className="neu-input" /></div>
            <div><label className="neu-label">Phone</label><input {...register('phone', { required: true })} className="neu-input" /></div>
            <div><label className="neu-label">Email</label><input type="email" {...register('email', { required: true })} className="neu-input" /></div>
            <div><label className="neu-label">Latitude</label><input type="number" step="any" {...register('lat', { required: true })} className="neu-input" /></div>
            <div><label className="neu-label">Longitude</label><input type="number" step="any" {...register('lng', { required: true })} className="neu-input" /></div>
            <div><label className="neu-label">Open Time</label><input type="time" {...register('openTime', { required: true })} className="neu-input" /></div>
            <div><label className="neu-label">Close Time</label><input type="time" {...register('closeTime', { required: true })} className="neu-input" /></div>
            <div className="md:col-span-2 pt-4">
               <button type="submit" className="neu-btn-primary w-full py-4 text-center">Save Hospital</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6">
        {hospitals.map((h) => (
          <div key={h._id} className="neu-card p-6 flex justify-between items-center">
             <div>
                <h3 className="text-xl font-bold text-gray-800">{h.name}</h3>
                <p className="text-gray-500 mt-1">{h.city}</p>
             </div>
             <button onClick={() => deleteHospital(h._id)} className="neu-btn-danger px-4">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
