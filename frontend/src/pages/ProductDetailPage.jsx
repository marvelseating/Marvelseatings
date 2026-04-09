// ProductDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProduct } from '../utils/api';
import { SkeletonCard, PageHero, PriceRequestModal } from '../components/UI';

export function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState({ name: '', model: '' });

  useEffect(() => {
    getProduct(slug).then(res => setProduct(res.data.data)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="pt-20 max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );

  if (!product) return (
    <div className="pt-20 min-h-screen flex items-center justify-center">
      <div className="text-center"><p className="text-2xl font-display text-gray-400">Product not found</p><Link to="/products" className="btn-primary mt-4">Back to Products</Link></div>
    </div>
  );

  return (
    <>
      <PageHero title={product.name} subtitle={product.description} breadcrumb={`Products / ${product.name}`} />
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {product.models.map((model, i) => (
            <motion.div key={model._id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="card group"
            >
              <div className="relative bg-gray-100 h-52 overflow-hidden">
                <img src={model.images?.[0] || 'https://placehold.co/600x450/e2e8f0/94a3b8?text=Product'} alt={model.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 right-3 badge bg-white text-gray-600 shadow">{model.modelNumber}</span>
              </div>
              <div className="p-5">
                <h3 className="font-display font-semibold text-brand text-lg mb-1">{model.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4">{model.description}</p>
                <div className="flex gap-2">
                  <button onClick={() => { setSelected({ name: model.name, model: model.modelNumber }); setModalOpen(true); }}
                    className="flex-1 btn-primary text-sm py-2 justify-center">Request Price</button>
                  <Link to={`/products/${slug}/models/${model.modelNumber}`}
                    className="px-4 py-2 border-2 border-brand/20 hover:border-brand text-brand text-sm font-medium rounded-lg transition-colors">Details</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      <PriceRequestModal isOpen={modalOpen} onClose={() => setModalOpen(false)} productName={selected.name} modelNumber={selected.model} />
    </>
  );
}

export default ProductDetailPage;
