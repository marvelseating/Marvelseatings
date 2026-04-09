const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

// GET all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, featured, limit } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;

    let productsQuery = Product.find(query)
      .populate('category', 'name slug')
      .sort('order');

    if (limit) productsQuery = productsQuery.limit(parseInt(limit));

    // Filter featured models if requested
    let products = await productsQuery;
    if (featured === 'true') {
      products = products.map(p => ({
        ...p.toObject(),
        models: p.models.filter(m => m.featured).slice(0, 2)
      })).filter(p => p.models.length > 0);
    }

    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single product by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET product model detail (public)
router.get('/:slug/models/:modelNumber', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category', 'name slug');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const model = product.models.find(m => m.modelNumber === req.params.modelNumber);
    if (!model) return res.status(404).json({ success: false, message: 'Model not found' });

    res.json({ success: true, data: { product, model } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Admin Routes ───────────────────────────────────────

// POST create product
router.post('/', protect, upload.single('coverImage'), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    if (req.file) {
      data.coverImage = req.file.path || `/uploads/images/${req.file.filename}`;
    }
    const product = await Product.create(data);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT update product
router.put('/:id', protect, upload.single('coverImage'), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    if (req.file) {
      data.coverImage = req.file.path || `/uploads/images/${req.file.filename}`;
    }
    const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE product
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST add model to product
router.post('/:id/models', protect, upload.array('images', 5), async (req, res) => {
  try {
    const modelData = JSON.parse(req.body.data || '{}');
    if (req.files && req.files.length > 0) {
      modelData.images = req.files.map(f => f.path || `/uploads/images/${f.filename}`);
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    product.models.push(modelData);
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT update model
router.put('/:id/models/:modelId', protect, upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const model = product.models.id(req.params.modelId);
    if (!model) return res.status(404).json({ success: false, message: 'Model not found' });

    const updates = JSON.parse(req.body.data || '{}');
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map(f => f.path || `/uploads/images/${f.filename}`);
    }
    Object.assign(model, updates);
    await product.save();
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE model from product
router.delete('/:id/models/:modelId', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    product.models.pull(req.params.modelId);
    await product.save();
    res.json({ success: true, message: 'Model removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
