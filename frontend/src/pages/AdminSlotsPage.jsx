import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axiosConfig';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

export default function AdminSlotsPage() {
  const [hospitals, setHospitals] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm();
  const { register: reg2, handleSubmit: handle2, reset: reset2 } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hRes, vRes] = await Promise.all([
          api.get('/hospitals/search'),
          api.get('/vaccines')
        ]);
        setHospitals(hRes.data.data?.hospitals || []);
        setVaccines(vRes.data.data?.vaccines || []);
      } catch (error) { toast.error("Failed to load"); }
      setLoading(false);
    };
    fetchData();
  }, []);

  const addOffering = async (data) => {
    try {
      await api.post(`/hospitals/${data.hospitalId}/vaccines`, {
        vaccineId: data.vaccineId,
        price: Number(data.price)
      });
      toast.success('Offering added');
      reset();
    } catch { toast.error('Failed to add offering'); }
  };

  const addSlots = async (data) => {
    try {
      await api.post(`/hospitals/${data.hospitalId}/vaccines/${data.vaccineId}/slots`, {
        date: data.date,
        total: Number(data.total)
      });
      toast.success('Slots configured');
      reset2();
    } catch { toast.error('Failed to configure slots'); }
  };

  if (loading) return <div className="flex h-64 justify-center items-center"><LoadingSpinner/></div>;

  return (
    <div className="mx-auto max-w-6xl animate-fade-in space-y-10 pb-12">
      <header className="neu-card p-8 bg-brand-50/20">
         <h1 className="text-3xl font-black text-gray-800 tracking-tight drop-shadow-sm">Slot & Availability Config</h1>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
         <div className="neu-card p-8">
            <h2 className="text-xl font-bold mb-6 text-brand-700">1. Associate Vaccine Offering</h2>
            <form onSubmit={handleSubmit(addOffering)} className="space-y-4">
               <div>
                  <label className="neu-label">Hospital</label>
                  <select {...register('hospitalId', { required: true })} className="neu-select">
                     <option value="">Select Hospital</option>
                     {hospitals.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
                  </select>
               </div>
               <div>
                  <label className="neu-label">Vaccine</label>
                  <select {...register('vaccineId', { required: true })} className="neu-select">
                     <option value="">Select Vaccine</option>
                     {vaccines.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
                  </select>
               </div>
               <div>
                  <label className="neu-label">Price</label>
                  <input type="number" {...register('price', { required: true })} className="neu-input" />
               </div>
               <button type="submit" className="neu-btn-primary w-full mt-4">Save Offering</button>
            </form>
         </div>

         <div className="neu-card p-8">
            <h2 className="text-xl font-bold mb-6 text-brand-700">2. Set Daily Capacity</h2>
            <form onSubmit={handle2(addSlots)} className="space-y-4">
               <div>
                  <label className="neu-label">Hospital</label>
                  <select {...reg2('hospitalId', { required: true })} className="neu-select">
                     <option value="">Select Hospital</option>
                     {hospitals.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
                  </select>
               </div>
               <div>
                  <label className="neu-label">Vaccine ID (offered ID)</label>
                  <input {...reg2('vaccineId', { required: true })} className="neu-input" placeholder="Paste Vaccine Object ID from DB" />
               </div>
               <div>
                  <label className="neu-label">Date</label>
                  <input type="date" {...reg2('date', { required: true })} className="neu-input" />
               </div>
               <div>
                  <label className="neu-label">Total Slots</label>
                  <input type="number" {...reg2('total', { required: true })} className="neu-input" />
               </div>
               <button type="submit" className="neu-btn-primary w-full mt-4">Configure Capacity</button>
            </form>
         </div>
      </div>
    </div>
  );
}
