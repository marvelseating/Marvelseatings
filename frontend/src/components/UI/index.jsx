import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiStar } from 'react-icons/hi';
import { submitPriceRequest } from '../../utils/api';
import toast from 'react-hot-toast';

// ─── Skeleton ─────────────────────────────────────────
export function SkeletonCard() {
  return (
    <div className="card p-4 space-y-3">
      <div className="skeleton h-48 w-full rounded-xl" />
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-5/6 rounded" />
      <div className="skeleton h-10 w-32 rounded-lg" />
    </div>
  );
}

export function SkeletonLine({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

// ─── Section Header ───────────────────────────────────
export function SectionHeader({ subtitle, title, description, center = true, light = false }) {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''}`}>
      {subtitle && (
        <p className={`section-subtitle ${light ? 'text-accent-light' : 'text-accent'}`}>{subtitle}</p>
      )}
      <h2 className={`section-title ${light ? 'text-white' : 'text-brand'}`}>{title}</h2>
      {description && (
        <p className={`mt-4 text-base leading-relaxed max-w-2xl ${center ? 'mx-auto' : ''} ${light ? 'text-white/70' : 'text-gray-500'}`}>
          {description}
        </p>
      )}
    </div>
  );
}

// ─── Star Rating ──────────────────────────────────────
export function StarRating({ rating = 5 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <HiStar key={s} className={`w-4 h-4 ${s <= rating ? 'text-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  );
}

// ─── Price Request Modal ──────────────────────────────
export function PriceRequestModal({ isOpen, onClose, productName = '', modelNumber = '' }) {
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    productName: productName, modelNumber: modelNumber,
    quantity: 1, message: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.productName.trim()) e.productName = 'Product name is required';
    return e;
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      await submitPriceRequest(form);
      toast.success("Request sent! We'll contact you within 24 hours.");
      onClose()
      setForm({ name: '', phone: '', email: '', productName, modelNumber, quantity: 1, message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-brand text-white px-6 py-5 rounded-t-2xl flex justify-between items-start">
              <div>
                <h3 className="font-display text-xl font-bold">Request a Price</h3>
                <p className="text-white/70 text-sm mt-0.5">We'll get back to you within 24 hours</p>
              </div>
              <button onClick={onClose} className="p-1 hover:text-accent transition-colors rounded-lg">
                <HiX className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange}
                    placeholder="Your name" className="input-field" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX" className="input-field" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  placeholder="your@email.com" className="input-field" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input name="productName" value={form.productName} onChange={handleChange}
                    placeholder="e.g. Office Chair" className="input-field" />
                  {errors.productName && <p className="text-red-500 text-xs mt-1">{errors.productName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model Number</label>
                  <input name="modelNumber" value={form.modelNumber} onChange={handleChange}
                    placeholder="e.g. EOC-001" className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange}
                  className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                <textarea name="message" value={form.message} onChange={handleChange}
                  rows={3} placeholder="Any specific requirements..." className="input-field resize-none" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full btn-primary justify-center py-3.5 disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Sending...
                  </span>
                ) : 'Send Price Request'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Page Hero Banner ─────────────────────────────────
export function PageHero({ title, subtitle, breadcrumb }) {
  return (
    <section className="bg-hero-pattern bg-brand pt-28 pb-16 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-10" />
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {breadcrumb && (
          <p className="text-white/50 text-sm mb-2 font-body">{breadcrumb}</p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-5xl font-bold"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-white/70 text-lg max-w-2xl"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
