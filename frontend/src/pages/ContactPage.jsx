import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiPhone, HiMail, HiLocationMarker, HiClock } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { submitContact } from '../utils/api';
import { PageHero } from '../components/UI';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name required';
    if (!form.email.trim() || !/\S+@\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.message.trim()) e.message = 'Message required';
    return e;
  };

  const handleChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await submitContact(form);
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <>
      <PageHero title="Contact Us" subtitle="Get in touch for enquiries, quotations, or any assistance" breadcrumb="Home / Contact" />

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="section-title mb-6">Get in Touch</h2>
            <div className="space-y-5">
              {[
                { icon: HiLocationMarker, label: 'Address', value: 'No 1/638, Veerathamman Koil Street, St. John\'s School Road, Jalladianpet, Chennai - 600100, Tamil Nadu, India' },
                { icon: HiPhone, label: 'Phone', value: '8045801616', href: 'tel:8045801616' },
                { icon: HiMail, label: 'Email', value: 'info@marvelseating.com', href: 'mailto:info@marvelseating.com' },
                { icon: HiClock, label: 'Working Hours', value: 'Monday – Saturday: 9:00 AM – 6:00 PM' },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="text-brand w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</div>
                    {href ? (
                      <a href={href} className="text-gray-700 hover:text-brand transition-colors font-medium">{value}</a>
                    ) : (
                      <p className="text-gray-700 font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}

              <a href="https://wa.me/918045801616" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-3 rounded-xl transition-colors mt-2">
                <FaWhatsapp className="w-5 h-5" /> Chat on WhatsApp
              </a>
            </div>

            {/* Map */}
            <div className="mt-8 rounded-2xl overflow-hidden shadow-md h-60 bg-gray-100">
              <iframe
                title="Marvel Seating Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d80.2!3d12.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU0JzAwLjAiTiA4MMKwMTInMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
              />
            </div>
          </div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h3 className="font-display text-2xl font-bold text-brand mb-1">Send a Message</h3>
              <p className="text-gray-500 text-sm mb-6">We typically reply within a business day.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" className="input-field" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className="input-field" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Tell us about your requirement..." className="input-field resize-none" />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>
                <button type="submit" disabled={loading}
                  className="w-full btn-primary justify-center py-3.5 text-base disabled:opacity-60">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
