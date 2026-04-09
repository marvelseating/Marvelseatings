import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSearch } from 'react-icons/hi';
import { getCategories, getProducts } from '../utils/api';
import { SkeletonCard, PageHero, PriceRequestModal } from '../components/UI';

export default function ProductsPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState({ name: '', model: '' });

  useEffect(() => {
    Promise.all([getCategories(), getProducts()])
      .then(([catRes, prodRes]) => {
        setCategories(catRes.data.data);
        setProducts(prodRes.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => {
    const catMatch = activeCategory === 'all' || p.category?._id === activeCategory || p.category?.slug === activeCategory;
    const searchMatch = search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.models.some(m => m.name.toLowerCase().includes(search.toLowerCase()));
    return catMatch && searchMatch;
  });

  const openModal = (name, model) => { setSelected({ name, model }); setModalOpen(true); };

  return (
    <>
      <PageHero title="Our Products" subtitle="Browse our complete range of seating and furniture solutions" breadcrumb="Home / Products" />

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-10 items-start md:items-center justify-between">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === 'all' ? 'bg-brand text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                All Products
              </button>
              {categories.map(cat => (
                <button
                  key={cat._id}
                  onClick={() => setActiveCategory(cat._id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat._id ? 'bg-brand text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="input-field pl-9 py-2.5 text-sm"
              />
            </div>
          </div>

          {/* Products */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm mt-1">Try a different category or search term</p>
            </div>
          ) : (
            filtered.map(product => (
              <div key={product._id} className="mb-12">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="font-display text-xl font-bold text-brand px-4">{product.name}</span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>
                {product.description && (
                  <p className="text-gray-500 text-sm mb-6 text-center max-w-2xl mx-auto">{product.description}</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {product.models.map((model, i) => (
                    <motion.div
                      key={model._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="card group"
                    >
                      <div className="relative overflow-hidden bg-gray-100 h-52">
                        <img
                          src={model.images?.[0] || 'https://placehold.co/600x450/e2e8f0/94a3b8?text=Product+Image'}
                          alt={model.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3">
                          <span className="badge bg-white text-gray-600 shadow-sm text-xs">{model.modelNumber}</span>
                        </div>
                        {model.featured && (
                          <div className="absolute top-3 left-3">
                            <span className="badge bg-accent text-white">Featured</span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-display font-semibold text-brand text-lg mb-1 leading-tight">{model.name}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-3">{model.description}</p>
                        {model.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {model.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal(model.name, model.modelNumber)}
                            className="flex-1 btn-primary text-sm py-2 justify-center"
                          >
                            Request Price
                          </button>
                          <Link
                            to={`/products/${product.slug}/models/${model.modelNumber}`}
                            className="px-4 py-2 border-2 border-brand/20 hover:border-brand text-brand text-sm font-medium rounded-lg transition-colors"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <PriceRequestModal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        productName={selected.name} modelNumber={selected.model} />
    </>
  );
}
