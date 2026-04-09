import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiCheckCircle } from 'react-icons/hi';
import { getProductModel } from '../utils/api';
import { PriceRequestModal, SkeletonLine } from '../components/UI';

export default function ModelDetailPage() {
  const { slug, modelNumber } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getProductModel(slug, modelNumber)
      .then(res => setData(res.data.data))
      .finally(() => setLoading(false));
  }, [slug, modelNumber]);

  if (loading) return (
    <div className="pt-24 max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      <div className="space-y-4">
        <SkeletonLine className="h-80 w-full rounded-2xl" />
        <div className="flex gap-2">{[...Array(3)].map((_, i) => <SkeletonLine key={i} className="h-20 w-20 rounded-xl" />)}</div>
      </div>
      <div className="space-y-4">
        <SkeletonLine className="h-8 w-3/4 rounded" />
        <SkeletonLine className="h-4 w-full rounded" />
        <SkeletonLine className="h-4 w-5/6 rounded" />
        <SkeletonLine className="h-32 w-full rounded-xl" />
        <SkeletonLine className="h-12 w-40 rounded-lg" />
      </div>
    </div>
  );

  if (!data) return (
    <div className="pt-24 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl font-display text-gray-400">Model not found</p>
        <Link to="/products" className="btn-primary mt-4 inline-flex">Back to Products</Link>
      </div>
    </div>
  );

  const { product, model } = data;
  const images = model.images?.length ? model.images : ['https://placehold.co/800x600/e2e8f0/94a3b8?text=Product+Image'];

  return (
    <div className="pt-20">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/products" className="hover:text-brand transition-colors">Products</Link>
          <span>/</span>
          <Link to={`/products/${slug}`} className="hover:text-brand transition-colors">{product.name}</Link>
          <span>/</span>
          <span className="text-brand font-medium">{model.modelNumber}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to={`/products/${slug}`} className="inline-flex items-center gap-1 text-brand hover:text-accent font-medium text-sm mb-8 transition-colors">
          <HiArrowLeft /> Back to {product.name}
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-100 rounded-2xl overflow-hidden h-80 md:h-96"
            >
              <img
                src={images[activeImg]}
                alt={model.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-accent' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <span className="badge bg-brand/10 text-brand text-xs">{product.category?.name}</span>
              <span className="badge bg-gray-100 text-gray-500 text-xs">{model.modelNumber}</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-brand mt-2">{model.name}</h1>
            <p className="text-gray-600 mt-3 leading-relaxed">{model.description}</p>

            {model.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {model.tags.map(t => (
                  <span key={t} className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">{t}</span>
                ))}
              </div>
            )}

            {/* Specifications */}
            {model.specifications?.length > 0 && (
              <div className="mt-6">
                <h3 className="font-display font-semibold text-brand text-lg mb-3">Specifications</h3>
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                  {model.specifications.map((spec, i) => (
                    <div key={i} className={`flex py-3 px-4 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                      <span className="w-40 text-sm font-medium text-gray-500 shrink-0">{spec.key}</span>
                      <span className="text-sm text-gray-800 font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 space-y-3">
              <button onClick={() => setModalOpen(true)} className="w-full btn-primary justify-center py-3.5 text-base">
                Request Price for This Model
              </button>
              <a href="tel:8045801616"
                className="w-full btn-secondary justify-center py-3.5 text-base">
                Call: 8045801616
              </a>
            </div>

            <div className="mt-5 p-4 bg-green-50 rounded-xl border border-green-100 flex items-start gap-3">
              <HiCheckCircle className="text-green-500 w-5 h-5 mt-0.5 shrink-0" />
              <p className="text-green-700 text-sm">We'll respond to your price request within 24 hours with our best offer.</p>
            </div>
          </div>
        </div>
      </div>

      <PriceRequestModal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        productName={model.name} modelNumber={model.modelNumber} />
    </div>
  );
}
