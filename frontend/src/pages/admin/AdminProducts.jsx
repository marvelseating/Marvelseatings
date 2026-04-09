import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiPencil, HiTrash, HiChevronDown, HiChevronUp, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import {
  getProducts, getCategories, createProduct, updateProduct, deleteProduct,
  addProductModel, deleteProductModel
} from '../../utils/api';

function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-display font-bold text-lg text-brand">{title}</h3>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors"><HiX className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedProduct, setExpandedProduct] = useState(null);

  // Product modal state
  const [productModal, setProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', category: '', description: '' });
  const [productLoading, setProductLoading] = useState(false);

  // Model modal state
  const [modelModal, setModelModal] = useState(false);
  const [modelProductId, setModelProductId] = useState(null);
  const [modelForm, setModelForm] = useState({ modelNumber: '', name: '', description: '', tags: '', specKey: [''], specVal: [''] });
  const [modelImages, setModelImages] = useState([]);
  const [modelLoading, setModelLoading] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([getProducts(), getCategories()])
      .then(([pRes, cRes]) => {
        setProducts(pRes.data.data);
        setCategories(cRes.data.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  // Product CRUD
  const openCreateProduct = () => {
    setEditProduct(null);
    setProductForm({ name: '', category: categories[0]?._id || '', description: '' });
    setProductModal(true);
  };

  const openEditProduct = (p) => {
    setEditProduct(p);
    setProductForm({ name: p.name, category: p.category?._id || '', description: p.description || '' });
    setProductModal(true);
  };

  const handleProductSubmit = async e => {
    e.preventDefault();
    if (!productForm.name || !productForm.category) { toast.error('Name and category required'); return; }
    setProductLoading(true);
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(productForm));
      if (editProduct) {
        await updateProduct(editProduct._id, formData);
        toast.success('Product updated');
      } else {
        await createProduct(formData);
        toast.success('Product created');
      }
      setProductModal(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setProductLoading(false); }
  };

  const handleDeleteProduct = async id => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      loadData();
    } catch { toast.error('Failed to delete'); }
  };

  // Model CRUD
  const openAddModel = (productId) => {
    setModelProductId(productId);
    setModelForm({ modelNumber: '', name: '', description: '', tags: '', specKey: [''], specVal: [''] });
    setModelImages([]);
    setModelModal(true);
  };

  const addSpecRow = () => setModelForm(p => ({ ...p, specKey: [...p.specKey, ''], specVal: [...p.specVal, ''] }));

  const handleModelSubmit = async e => {
    e.preventDefault();
    if (!modelForm.modelNumber || !modelForm.name) { toast.error('Model number and name required'); return; }
    setModelLoading(true);
    try {
      const specifications = modelForm.specKey
        .map((k, i) => ({ key: k, value: modelForm.specVal[i] }))
        .filter(s => s.key && s.value);
      const data = {
        modelNumber: modelForm.modelNumber,
        name: modelForm.name,
        description: modelForm.description,
        tags: modelForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        specifications
      };
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      modelImages.forEach(img => formData.append('images', img));
      await addProductModel(modelProductId, formData);
      toast.success('Model added');
      setModelModal(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setModelLoading(false); }
  };

  const handleDeleteModel = async (productId, modelId) => {
    if (!confirm('Delete this model?')) return;
    try {
      await deleteProductModel(productId, modelId);
      toast.success('Model deleted');
      loadData();
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-800">Products</h2>
          <p className="text-gray-500 text-sm">Manage product categories and models</p>
        </div>
        <button onClick={openCreateProduct} className="btn-primary text-sm py-2">
          <HiPlus /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          <p>No products yet. Add your first product!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map(product => (
            <div key={product._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              {/* Product Header */}
              <div className="flex items-center gap-4 p-5">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-brand">{product.name}</h3>
                    <span className="badge bg-gray-100 text-gray-500 text-xs">{product.category?.name}</span>
                    <span className="badge bg-blue-100 text-blue-600 text-xs">{product.models?.length || 0} models</span>
                  </div>
                  {product.description && <p className="text-gray-400 text-sm mt-0.5 line-clamp-1">{product.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openAddModel(product._id)}
                    className="text-sm bg-brand/10 text-brand hover:bg-brand/20 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1">
                    <HiPlus className="w-4 h-4" /> Add Model
                  </button>
                  <button onClick={() => openEditProduct(product)}
                    className="p-2 text-gray-400 hover:text-brand hover:bg-gray-100 rounded-lg transition-colors">
                    <HiPencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteProduct(product._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <HiTrash className="w-4 h-4" />
                  </button>
                  <button onClick={() => setExpandedProduct(expandedProduct === product._id ? null : product._id)}
                    className="p-2 text-gray-400 hover:text-brand rounded-lg transition-colors">
                    {expandedProduct === product._id ? <HiChevronUp className="w-4 h-4" /> : <HiChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Models Accordion */}
              <AnimatePresence>
                {expandedProduct === product._id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    className="overflow-hidden border-t border-gray-100">
                    {product.models?.length === 0 ? (
                      <p className="px-5 py-4 text-gray-400 text-sm">No models yet. Add a model above.</p>
                    ) : (
                      <div className="divide-y divide-gray-50">
                        {product.models.map(model => (
                          <div key={model._id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors">
                            <img src={model.images?.[0] || 'https://placehold.co/80x60/e2e8f0/94a3b8?text=Img'} alt={model.name}
                              className="w-16 h-12 rounded-lg object-cover shrink-0 border border-gray-100" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-700 text-sm">{model.name}</div>
                              <div className="text-gray-400 text-xs">{model.modelNumber}</div>
                            </div>
                            <div className="flex items-center gap-1">
                              {model.featured && <span className="badge bg-accent/10 text-accent text-xs">Featured</span>}
                              <button onClick={() => handleDeleteModel(product._id, model._id)}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <HiTrash className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      {/* Product Modal */}
      <Modal isOpen={productModal} onClose={() => setProductModal(false)} title={editProduct ? 'Edit Product' : 'Add New Product'}>
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input value={productForm.name} onChange={e => setProductForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Executive Office Chair" className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select value={productForm.category} onChange={e => setProductForm(p => ({ ...p, category: e.target.value }))} className="input-field">
              <option value="">Select category</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={productForm.description} onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))}
              rows={3} className="input-field resize-none" placeholder="Short description..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setProductModal(false)} className="flex-1 btn-secondary justify-center py-2.5 text-sm">Cancel</button>
            <button type="submit" disabled={productLoading} className="flex-1 btn-primary justify-center py-2.5 text-sm disabled:opacity-60">
              {productLoading ? 'Saving...' : editProduct ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Model Modal */}
      <Modal isOpen={modelModal} onClose={() => setModelModal(false)} title="Add New Model">
        <form onSubmit={handleModelSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model Number *</label>
              <input value={modelForm.modelNumber} onChange={e => setModelForm(p => ({ ...p, modelNumber: e.target.value }))}
                placeholder="EOC-001" className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model Name *</label>
              <input value={modelForm.name} onChange={e => setModelForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Executive Chair" className="input-field" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={modelForm.description} onChange={e => setModelForm(p => ({ ...p, description: e.target.value }))}
              rows={2} className="input-field resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input value={modelForm.tags} onChange={e => setModelForm(p => ({ ...p, tags: e.target.value }))}
              placeholder="ergonomic, leather, executive" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
            <input type="file" multiple accept="image/*" onChange={e => setModelImages(Array.from(e.target.files))}
              className="input-field text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-brand file:text-white file:text-xs file:cursor-pointer" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Specifications</label>
              <button type="button" onClick={addSpecRow} className="text-xs text-brand hover:text-accent font-medium flex items-center gap-1">
                <HiPlus className="w-3 h-3" /> Add row
              </button>
            </div>
            <div className="space-y-2">
              {modelForm.specKey.map((k, i) => (
                <div key={i} className="grid grid-cols-2 gap-2">
                  <input value={k} onChange={e => { const arr = [...modelForm.specKey]; arr[i] = e.target.value; setModelForm(p => ({ ...p, specKey: arr })); }}
                    placeholder="e.g. Material" className="input-field py-2 text-sm" />
                  <input value={modelForm.specVal[i]} onChange={e => { const arr = [...modelForm.specVal]; arr[i] = e.target.value; setModelForm(p => ({ ...p, specVal: arr })); }}
                    placeholder="e.g. PU Leather" className="input-field py-2 text-sm" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModelModal(false)} className="flex-1 btn-secondary justify-center py-2.5 text-sm">Cancel</button>
            <button type="submit" disabled={modelLoading} className="flex-1 btn-primary justify-center py-2.5 text-sm disabled:opacity-60">
              {modelLoading ? 'Adding...' : 'Add Model'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
