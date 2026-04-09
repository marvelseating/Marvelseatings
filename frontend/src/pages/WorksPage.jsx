// WorksPage.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getWorks } from '../utils/api';
import { PageHero, SectionHeader, SkeletonCard } from '../components/UI';

export function WorksPage() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    getWorks().then(res => setWorks(res.data.data)).finally(() => setLoading(false));
  }, []);

  const categories = ['all', ...new Set(works.map(w => w.category).filter(Boolean))];
  const filtered = activeFilter === 'all' ? works : works.filter(w => w.category === activeFilter);

  return (
    <>
      <PageHero title="Our Works" subtitle="Projects we've completed for businesses across Chennai and beyond" breadcrumb="Home / Our Works" />
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {categories.map(c => (
            <button key={c} onClick={() => setActiveFilter(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${activeFilter === c ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {c === 'all' ? 'All Projects' : c}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((work, i) => (
              <motion.div key={work._id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="card group"
              >
                <div className="relative bg-gray-100 h-52 overflow-hidden">
                  <img src={work.images?.[0] || 'https://placehold.co/800x500/e2e8f0/94a3b8?text=Project+Image'} alt={work.projectTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {work.category && (
                    <span className="absolute top-3 left-3 badge bg-accent text-white">{work.category}</span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-brand text-lg">{work.companyName}</h3>
                  <p className="text-accent font-medium text-sm mt-0.5">{work.projectTitle}</p>
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">{work.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default WorksPage;
