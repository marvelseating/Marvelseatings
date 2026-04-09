import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight, HiShieldCheck, HiTruck, HiStar, HiPhone } from 'react-icons/hi';
import { FaTools, FaBroom, FaCouch, FaHammer } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { getProducts, getTestimonials } from '../utils/api';
import { SkeletonCard, StarRating, PriceRequestModal } from '../components/UI';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
};

const services = [
  { icon: FaTools, title: 'Office Chair Servicing', desc: 'Complete repair, maintenance and servicing of all office chair types.', color: 'bg-blue-50 text-blue-600' },
  { icon: FaBroom, title: 'Blinds & Carpet Cleaning', desc: 'Professional deep cleaning for blinds and carpets in offices and hotels.', color: 'bg-green-50 text-green-600' },
  { icon: FaCouch, title: 'Sofa Rework', desc: 'Expert reupholstery and foam replacement to restore your sofas.', color: 'bg-orange-50 text-orange-600' },
  { icon: FaHammer, title: 'Carpentry Work', desc: 'Custom carpentry solutions for office furniture and fixtures.', color: 'bg-purple-50 text-purple-600' },
];

const reasons = [
  { icon: HiShieldCheck, title: '18+ Years Experience', desc: 'Serving clients across Chennai since 2006 with consistent quality.' },
  { icon: HiTruck, title: 'Bulk Order Ready', desc: 'Spacious warehouse facilities for handling large and urgent orders.' },
  { icon: HiStar, title: 'Quality Assured', desc: 'Strict quality control ensuring international standards every time.' },
  { icon: HiPhone, title: 'Dedicated Support', desc: 'Customer support team always available to address your needs.' },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({ name: '', model: '' });

  useEffect(() => {
    getProducts({ featured: true, limit: 6 })
      .then(res => setProducts(res.data.data))
      .catch(() => {})
      .finally(() => setLoadingProducts(false));
    getTestimonials()
      .then(res => setTestimonials(res.data.data.filter(t => t.featured)))
      .catch(() => {});
  }, []);

  const openModal = (name, model) => {
    setSelectedProduct({ name, model });
    setModalOpen(true);
  };

  return (
    <>
      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-brand-dark overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern" />
        <div className="absolute inset-0 bg-pattern opacity-10" />
        <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-5">
          <svg viewBox="0 0 500 500" className="w-full h-full">
            <polygon points="250,0 500,500 0,500" fill="white" />
          </svg>
        </div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
              className="inline-flex items-center gap-2 bg-accent/20 text-accent-light border border-accent/30 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              Chennai's Trusted Furniture Partner Since 2006
            </motion.div>
            <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Premium Seating <span className="text-accent">Solutions</span> for Every Space
            </motion.h1>
            <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="mt-6 text-white/70 text-lg leading-relaxed">
              Marvel Seating System — manufacturer, supplier, and trader of quality office chairs, sofas, and furniture. Trusted by 500+ businesses across Chennai.
            </motion.p>
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
              className="flex flex-wrap gap-4 mt-8">
              <Link to="/products" className="btn-primary text-base">
                Explore Products <HiArrowRight />
              </Link>
              <Link to="/contact" className="btn-outline-white text-base">
                Get a Quote
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
              className="flex gap-8 mt-10">
              {[['500+', 'Happy Clients'], ['18+', 'Years Experience'], ['1000+', 'Units Delivered']].map(([num, label]) => (
                <div key={label}>
                  <div className="font-display text-3xl font-bold text-accent">{num}</div>
                  <div className="text-white/60 text-sm">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right side - floating cards */}
          <div className="hidden md:flex justify-center items-center relative h-96">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 w-72 shadow-2xl"
            >
              <div className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">Featured Product</div>
              <div className="bg-white/10 rounded-xl h-36 flex items-center justify-center mb-4">
                <span className="text-5xl">🪑</span>
              </div>
              <div className="text-white font-display font-semibold">Executive High Back Chair</div>
              <div className="text-white/50 text-sm mt-1">Premium ergonomic design</div>
              <button onClick={() => openModal('Executive High Back Chair', 'EOC-001')}
                className="mt-4 w-full bg-accent hover:bg-accent-dark text-white text-sm font-medium py-2 rounded-lg transition-colors">
                Request Price
              </button>
            </motion.div>

            {[
              { emoji: '🛋️', text: 'Lobby Sofas', top: '-top-4', left: 'right-0' },
              { emoji: '⭐', text: '5-Star Rated', bottom: '-bottom-4', right: 'left-0' },
            ].map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.15 }}
                className={`absolute ${item.top || ''} ${item.bottom || ''} ${item.left || ''} ${item.right || ''} bg-white rounded-xl shadow-xl p-3 flex items-center gap-2`}
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-brand font-semibold text-sm">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        >
          <span className="text-white/40 text-xs">Scroll down</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </section>

      {/* ── Services ───────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">What We Do</p>
            <h2 className="section-title">Our Core Services</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">From manufacturing to servicing, we provide end-to-end furniture solutions for businesses of all sizes.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <motion.div key={s.title}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
                className="card p-6 text-center hover:-translate-y-1 cursor-default"
              >
                <div className={`w-14 h-14 ${s.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <s.icon className="w-7 h-7" />
                </div>
                <h3 className="font-display font-semibold text-brand text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ───────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="section-subtitle">Our Range</p>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <Link to="/products" className="mt-4 md:mt-0 text-brand font-semibold flex items-center gap-1 hover:gap-2 transition-all hover:text-accent">
              View All Products <HiArrowRight />
            </Link>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.flatMap(p =>
                p.models.map(m => (
                  <motion.div key={m._id}
                    variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                    className="card group"
                  >
                    <div className="relative overflow-hidden bg-gray-100 h-52">
                      <img
                        src={m.images?.[0] || 'https://placehold.co/600x450/e2e8f0/94a3b8?text=Product+Image'}
                        alt={m.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="badge bg-brand text-white">{p.category?.name}</span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="badge bg-white text-gray-600 shadow">{m.modelNumber}</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display font-semibold text-brand text-lg leading-tight mb-1">{m.name}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4">{m.description}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal(m.name, m.modelNumber)}
                          className="flex-1 btn-primary text-sm py-2 justify-center"
                        >
                          Request Price
                        </button>
                        <Link
                          to={`/products/${p.slug}/models/${m.modelNumber}`}
                          className="px-4 py-2 border-2 border-brand/20 hover:border-brand text-brand text-sm font-medium rounded-lg transition-colors"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────── */}
      <section className="py-20 bg-brand text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10" />
        <div className="absolute right-0 top-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-2">Why Us</p>
            <h2 className="font-display text-4xl font-bold text-white">Why Clients Choose Marvel Seating</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {reasons.map((r, i) => (
              <motion.div key={r.title}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
                className="text-center"
              >
                <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <r.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{r.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="section-subtitle">Client Feedback</p>
              <h2 className="section-title">What Our Clients Say</h2>
            </div>
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
              autoplay={{ delay: 4000 }}
              pagination={{ clickable: true }}
              className="pb-12"
            >
              {testimonials.map(t => (
                <SwiperSlide key={t._id}>
                  <div className="card p-6 h-full flex flex-col">
                    <StarRating rating={t.rating} />
                    <p className="text-gray-600 text-sm leading-relaxed mt-3 flex-1 italic">"{t.review}"</p>
                    <div className="mt-4 flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {t.clientName[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-brand text-sm">{t.clientName}</div>
                        {t.company && <div className="text-gray-400 text-xs">{t.designation && `${t.designation}, `}{t.company}</div>}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section className="py-16 bg-accent">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">Ready to furnish your space?</h2>
          <p className="mt-3 text-white/80 text-lg">Get in touch with us for the best pricing on bulk or retail orders.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a href="tel:8045801616" className="bg-white text-accent font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
              <HiPhone /> Call Now: 8045801616
            </a>
            <Link to="/contact" className="border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
              Send Enquiry
            </Link>
          </div>
        </div>
      </section>

      <PriceRequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        productName={selectedProduct.name}
        modelNumber={selectedProduct.model}
      />
    </>
  );
}
