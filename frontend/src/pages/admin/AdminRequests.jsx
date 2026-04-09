import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiTrash, HiMail, HiPhone, HiCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { getPriceRequests, updatePriceRequest, deletePriceRequest } from '../../utils/api';

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-700 border-blue-200',
  viewed: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  contacted: 'bg-green-100 text-green-700 border-green-200',
  closed: 'bg-gray-100 text-gray-500 border-gray-200',
};

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const load = () => {
    setLoading(true);
    getPriceRequests({ status: filter !== 'all' ? filter : undefined })
      .then(res => setRequests(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await updatePriceRequest(id, { status });
      setRequests(prev => prev.map(r => r._id === id ? { ...r, status } : r));
      toast.success('Status updated');
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async id => {
    if (!confirm('Delete this request?')) return;
    try {
      await deletePriceRequest(id);
      setRequests(prev => prev.filter(r => r._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-800">Price Requests</h2>
          <p className="text-gray-500 text-sm">{requests.length} total enquiries</p>
        </div>
        <div className="flex gap-2">
          {['all', 'new', 'viewed', 'contacted', 'closed'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${filter === s ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}</div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">No requests found</div>
      ) : (
        <div className="space-y-2">
          {requests.map(req => (
            <div key={req._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(expanded === req._id ? null : req._id)}
              >
                <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center text-brand font-bold shrink-0">
                  {req.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800">{req.name}</div>
                  <div className="text-gray-400 text-sm">{req.productName} {req.modelNumber && `· ${req.modelNumber}`} · Qty: {req.quantity}</div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`badge text-xs border ${STATUS_COLORS[req.status]}`}>{req.status}</span>
                  <span className="text-gray-400 text-xs">{new Date(req.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
              </div>

              {expanded === req._id && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="border-t border-gray-100 px-5 py-4 space-y-3">
                  <div className="grid sm:grid-cols-3 gap-3">
                    <a href={`mailto:${req.email}`} className="flex items-center gap-2 text-sm text-brand hover:text-accent">
                      <HiMail className="w-4 h-4" /> {req.email}
                    </a>
                    <a href={`tel:${req.phone}`} className="flex items-center gap-2 text-sm text-brand hover:text-accent">
                      <HiPhone className="w-4 h-4" /> {req.phone}
                    </a>
                    {req.message && <p className="text-gray-500 text-sm italic">"{req.message}"</p>}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-xs text-gray-500 font-medium">Change status:</span>
                    {['new', 'viewed', 'contacted', 'closed'].map(s => (
                      <button key={s} onClick={() => updateStatus(req._id, s)}
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all border ${req.status === s ? STATUS_COLORS[s] : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}`}>
                        {s}
                      </button>
                    ))}
                    <button onClick={() => handleDelete(req._id)}
                      className="ml-auto flex items-center gap-1 px-3 py-1 rounded-full text-xs text-red-500 border border-red-200 hover:bg-red-50 transition-colors">
                      <HiTrash className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
