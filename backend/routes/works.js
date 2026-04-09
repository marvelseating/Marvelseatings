// works.js
const express = require('express');
const worksRouter = express.Router();
const { Work } = require('../models');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

worksRouter.get('/', async (req, res) => {
  try {
    const works = await Work.find({ isActive: true }).sort('-featured order');
    res.json({ success: true, data: works });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

worksRouter.post('/', protect, upload.array('images', 8), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    if (req.files) data.images = req.files.map(f => f.path || `/uploads/images/${f.filename}`);
    const work = await Work.create(data);
    res.status(201).json({ success: true, data: work });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

worksRouter.put('/:id', protect, upload.array('images', 8), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    if (req.files && req.files.length) data.images = req.files.map(f => f.path || `/uploads/images/${f.filename}`);
    const work = await Work.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json({ success: true, data: work });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

worksRouter.delete('/:id', protect, async (req, res) => {
  try {
    await Work.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Work deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = worksRouter;
