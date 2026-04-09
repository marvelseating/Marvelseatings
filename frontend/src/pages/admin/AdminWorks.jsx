import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiPlus, HiTrash, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { getWorks, createWork, deleteWork } from '../../utils/api';

function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-display font-bold text-lg text-brand">{title}</h3>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><HiX className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function AdminWorks() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ companyName: '', projectTitle: '', description: '', category: '', featured: false });
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getWorks().then(res => setWorks(res.data.data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.companyName || !form.projectTitle) { toast.error('Company name and project title required'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('data', JSON.stringify(form));
      images.forEach(img => fd.append('images', img));
      await createWork(fd);
      toast.success('Work added');
      setModal(false);
      load();
    } catch { toast.error('Failed to add work'); } finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!confirm('Delete this work?')) return;
    try { await deleteWork(id); setWorks(prev => prev.filter(w => w._id !== id)); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-800">Our Works</h2>
          <p className="text-gray-500 text-sm">Showcase completed projects</p>
        </div>
        <button onClick={() => { setForm({ companyName: '', projectTitle: '', description: '', category: '', featured: false }); setImages([]); setModal(true); }}
          className="btn-primary text-sm py-2"><HiPlus /> Add Work</button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {works.map(work => (
            <div key={work._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm group">
              <div className="relative bg-gray-100 h-44">
                <img src={work.images?.[0] || 'https://placehold.co/800x500/e2e8f0/94a3b8?text=Project'} alt={work.projectTitle}
                  className="w-full h-full object-cover" />
                <button onClick={() => handleDelete(work._id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                  <HiTrash className="w-4 h-4" />
                </button>
                {work.featured && <span className="absolute top-2 left-2 badge bg-accent text-white text-xs">Featured</span>}
              </div>
              <div className="p-4">
                <h3 className="font-display font-bold text-brand text-sm">{work.companyName}</h3>
                <p className="text-gray-600 text-xs mt-0.5">{work.projectTitle}</p>
                {work.category && <span className="badge bg-gray-100 text-gray-500 text-xs mt-2 inline-block">{work.category}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Add Project">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
              <input value={form.companyName} onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))} className="input-field" placeholder="TechCorp Solutions" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
              <input value={form.projectTitle} onChange={e => setForm(p => ({ ...p, projectTitle: e.target.value }))} className="input-field" placeholder="Office Chair Setup" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="input-field" placeholder="Office Chairs" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className="input-field resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
            <input type="file" multiple accept="image/*" onChange={e => setImages(Array.from(e.target.files))}
              className="input-field text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-brand file:text-white file:text-xs" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} className="rounded" />
            <span className="text-sm text-gray-700">Mark as featured</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="flex-1 btn-secondary justify-center py-2.5 text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 btn-primary justify-center py-2.5 text-sm">{saving ? 'Saving...' : 'Add Work'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
