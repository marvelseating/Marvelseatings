import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTestimonials } from '../utils/api';
import { PageHero, StarRating } from '../components/UI';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTestimonials().then(res => setTestimonials(res.data.data)).finally(() => setLoading(false));
  }, []);

  const avgRating = testimonials.length
    ? (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)
    : 0;

  return (
    <>
      <PageHero title="Client Testimonials" subtitle="What our valued clients say about Marvel Seating System" breadcrumb="Home / Testimonials" />

      {/* Stats bar */}
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-center gap-10 text-center">
          <div>
            <div className="font-display text-3xl font-bold text-brand">{avgRating}</div>
            <div className="text-gray-500 text-sm">Average Rating</div>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-brand">{testimonials.length}+</div>
            <div className="text-gray-500 text-sm">Happy Clients</div>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-brand">500+</div>
            <div className="text-gray-500 text-sm">Projects Delivered</div>
          </div>
        </div>
      </div>

      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-52" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t._id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.1 }}
                className="card p-6 flex flex-col"
              >
                <StarRating rating={t.rating} />
                <blockquote className="text-gray-600 text-sm leading-relaxed mt-3 flex-1 italic">
                  "{t.review}"
                </blockquote>
                <div className="mt-5 flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-11 h-11 bg-gradient-to-br from-brand to-accent rounded-full flex items-center justify-center text-white font-bold">
                    {t.clientName[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-brand">{t.clientName}</div>
                    {(t.designation || t.company) && (
                      <div className="text-gray-400 text-xs">
                        {[t.designation, t.company].filter(Boolean).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
