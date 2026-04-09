// ─── categories.js ────────────────────────────────────
const express = require('express');
const router = express.Router();
const { Category } = require('../models');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const cats = await Category.find({ isActive: true }).sort('order');
    res.json({ success: true, data: cats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = req.file.path || `/uploads/images/${req.file.filename}`;
    const cat = await Category.create(data);
    res.status(201).json({ success: true, data: cat });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = req.file.path || `/uploads/images/${req.file.filename}`;
    const cat = await Category.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json({ success: true, data: cat });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
