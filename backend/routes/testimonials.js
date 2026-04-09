const express = require('express');
const router = express.Router();
const { Testimonial } = require('../models');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort('-featured order');
    res.json({ success: true, data: testimonials });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const t = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: t });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const t = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: t });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Testimonial.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
