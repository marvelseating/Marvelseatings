import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiPlus, HiTrash, HiX, HiStar } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { getTestimonials, createTestimonial, deleteTestimonial } from '../../utils/api';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ clientName: '', company: '', designation: '', review: '', rating: 5, featured: false });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getTestimonials().then(res => setTestimonials(res.data.data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.clientName || !form.review) { toast.error('Name and review required'); return; }
    setSaving(true);
    try {
      await createTestimonial(form);
      toast.success('Testimonial added');
      setModal(false);
      load();
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!confirm('Delete this testimonial?')) return;
    try { await deleteTestimonial(id); setTestimonials(prev => prev.filter(t => t._id !== id)); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-800">Testimonials</h2>
          <p className="text-gray-500 text-sm">{testimonials.length} client reviews</p>
        </div>
        <button onClick={() => { setForm({ clientName: '', company: '', designation: '', review: '', rating: 5, featured: false }); setModal(true); }}
          className="btn-primary text-sm py-2"><HiPlus /> Add Review</button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-44 rounded-2xl" />)}</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map(t => (
            <div key={t._id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm relative group">
              <button onClick={() => handleDelete(t._id)}
                className="absolute top-3 right-3 w-7 h-7 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <HiTrash className="w-3 h-3" />
              </button>
              <div className="flex gap-0.5 mb-2">
                {[1,2,3,4,5].map(s => <HiStar key={s} className={`w-4 h-4 ${s <= t.rating ? 'text-yellow-400' : 'text-gray-200'}`} />)}
              </div>
              <p className="text-gray-600 text-sm italic line-clamp-3">"{t.review}"</p>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="font-semibold text-brand text-sm">{t.clientName}</div>
                {(t.designation || t.company) && (
                  <div className="text-gray-400 text-xs">{[t.designation, t.company].filter(Boolean).join(', ')}</div>
                )}
              </div>
              {t.featured && <span className="absolute top-3 left-3 badge bg-accent text-white text-xs">Featured</span>}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60" onClick={() => setModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="font-display font-bold text-lg text-brand">Add Testimonial</h3>
                <button onClick={() => setModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><HiX className="w-5 h-5 text-gray-500" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
                    <input value={form.clientName} onChange={e => setForm(p => ({ ...p, clientName: e.target.value }))} className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} className="input-field" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                    <input value={form.designation} onChange={e => setForm(p => ({ ...p, designation: e.target.value }))} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <select value={form.rating} onChange={e => setForm(p => ({ ...p, rating: parseInt(e.target.value) }))} className="input-field">
                      {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Review *</label>
                  <textarea value={form.review} onChange={e => setForm(p => ({ ...p, review: e.target.value }))} rows={3} className="input-field resize-none" required />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} className="rounded" />
                  <span className="text-sm text-gray-700">Show as featured</span>
                </label>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)} className="flex-1 btn-secondary justify-center py-2.5 text-sm">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 btn-primary justify-center py-2.5 text-sm">{saving ? 'Saving...' : 'Add Review'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
