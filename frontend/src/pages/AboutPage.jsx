import { motion } from 'framer-motion';
import { HiCheckCircle } from 'react-icons/hi';
import { PageHero, SectionHeader } from '../components/UI';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
};

const keyFacts = [
  { label: 'Nature of Business', value: 'Manufacturer, Supplier, Trader' },
  { label: 'Year Established', value: '2006' },
  { label: 'Location', value: 'Chennai, Tamil Nadu, India' },
  { label: 'GST Number', value: '33AJWPR8444C2ZR' },
  { label: 'Employees', value: '07 Professionals' },
  { label: 'Banker', value: 'Union Bank of India' },
  { label: 'Annual Turnover', value: 'INR 1 Crore' },
  { label: 'Business States', value: 'Tamil Nadu, Kerala' },
];

const values = [
  { title: 'Transparency', desc: 'We uphold transparency in all business transactions, building greater trust with every client.' },
  { title: 'Integrity', desc: 'Our ethical practices guide every decision, ensuring complete and consistent customer satisfaction.' },
  { title: 'Quality', desc: 'Strict quality control ensures our products consistently meet international standards.' },
  { title: 'Reliability', desc: 'On-time delivery with dedicated support from enquiry to post-installation.' },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Marvel Seating System"
        subtitle="Your trusted partner for premium furniture and seating solutions in Chennai"
        breadcrumb="Home / About"
      />

      {/* Company Profile */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-14 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <p className="section-subtitle">Who We Are</p>
            <h2 className="section-title">A Legacy of Quality Since 2006</h2>
            <p className="mt-5 text-gray-600 leading-relaxed">
              Marvel Seating System is a noteworthy manufacturer, supplier, and trader based in Chennai, Tamil Nadu. We specialize in premium office chairs, lobby sofas, cafe chairs, bar stools, and a wide range of seating solutions for businesses of all scales.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Founded in 2006 by Mr. Rajesh Kumar, we have grown from a local supplier to a trusted name in the commercial furniture industry, serving clients across Tamil Nadu and Kerala.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              The principles of transparency, integrity, and quality serve as the foundation of our achievements, enabling us to guarantee complete customer satisfaction on every project.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {['ISO Quality Practices', 'Bulk Order Capacity', '500+ Clients Served', '18+ Years Experience'].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <HiCheckCircle className="text-accent shrink-0 w-5 h-5" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}
            className="grid grid-cols-2 gap-4">
            {[
              { num: '500+', label: 'Happy Clients', bg: 'bg-brand text-white' },
              { num: '18+', label: 'Years in Business', bg: 'bg-accent text-white' },
              { num: '1000+', label: 'Units Delivered', bg: 'bg-gray-100 text-brand' },
              { num: '4', label: 'Core Services', bg: 'bg-gray-100 text-brand' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-2xl p-6 flex flex-col items-center justify-center text-center`}>
                <div className="font-display text-4xl font-bold">{s.num}</div>
                <div className="text-sm mt-1 opacity-80 font-medium">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Key Facts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader subtitle="At a Glance" title="Key Company Facts" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {keyFacts.map((fact, i) => (
              <motion.div key={fact.label}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i % 4}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
              >
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">{fact.label}</div>
                <div className="font-display font-semibold text-brand">{fact.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader subtitle="Our Principles" title="Values We Stand By" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={v.title}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
                className="card p-6 border-t-4 border-accent"
              >
                <h3 className="font-display text-xl font-bold text-brand mb-3">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-brand text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader subtitle="The People" title="Our Team" light
            description="Our skilled team of 7 professionals is dedicated to ensuring every project receives equal attention regardless of budget." />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { name: 'Mr. Rajesh Kumar', role: 'Proprietor & Founder', emoji: '👔' },
              { name: 'Quality Control Team', role: 'Production & QA', emoji: '🔍' },
              { name: 'Customer Support', role: 'Client Relations', emoji: '🤝' },
            ].map((member, i) => (
              <motion.div key={member.name}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
                className="text-center"
              >
                <div className="w-20 h-20 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl">
                  {member.emoji}
                </div>
                <h3 className="font-display font-semibold text-lg">{member.name}</h3>
                <p className="text-white/60 text-sm mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
