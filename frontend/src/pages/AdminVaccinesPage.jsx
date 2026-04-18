import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axiosConfig';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

export default function AdminVaccinesPage() {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchVaccines();
  }, []);

  const fetchVaccines = async () => {
    try {
      const response = await api.get('/vaccines');
      setVaccines(response.data.data?.vaccines || []);
    } catch (error) {
       toast.error('Failed to load vaccines');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await api.post('/vaccines', data);
      toast.success('Vaccine added successfully');
      reset();
      setIsAdding(false);
      fetchVaccines();
    } catch (error) {
      toast.error('Failed to add vaccine');
    }
  };

  const deleteVaccine = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/vaccines/${id}`);
      toast.success('Vaccine deleted');
      fetchVaccines();
    } catch (error) {
      toast.error('Failed to delete vaccine');
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="mx-auto max-w-7xl animate-fade-in space-y-10 pb-12">
      <header className="flex justify-between items-center neu-card p-8">
        <div>
           <h1 className="text-3xl font-black text-gray-800 tracking-tight drop-shadow-sm">Vaccines Center</h1>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="neu-btn-primary">
          {isAdding ? 'Cancel' : '+ Add Vaccine'}
        </button>
      </header>

      {isAdding && (
        <div className="neu-inset rounded-neu-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
            <div><label className="neu-label">Name</label><input {...register('name', { required: true })} className="neu-input" /></div>
            <div><label className="neu-label">Manufacturer</label><input {...register('manufacturer', { required: true })} className="neu-input" /></div>
            <div><label className="neu-label">Recommended Doses</label><input type="number" {...register('recommendedDoses', { required: true })} className="neu-input" /></div>
            <div><label className="neu-label">Min Age</label><input type="number" {...register('minAge', { required: true })} className="neu-input" /></div>
            <div><label className="neu-label">Max Age</label><input type="number" {...register('maxAge', { required: true })} className="neu-input" /></div>
            <div><label className="neu-label">Gap (Days)</label><input type="number" {...register('gapBetweenDoses', { required: true })} className="neu-input" /></div>
            <div className="md:col-span-2 pt-4">
               <button type="submit" className="neu-btn-primary w-full py-4 text-center">Save Vaccine</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6">
        {vaccines.map((v) => (
          <div key={v._id} className="neu-card p-6 flex justify-between items-center">
             <div>
                <h3 className="text-xl font-bold text-gray-800">{v.name}</h3>
                <p className="text-gray-500 mt-1">{v.manufacturer} | {v.recommendedDoses} Doses</p>
             </div>
             <button onClick={() => deleteVaccine(v._id)} className="neu-btn-danger px-4">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
