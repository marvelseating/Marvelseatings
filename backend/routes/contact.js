const express = require('express');
const router = express.Router();
const { Contact } = require('../models');
const { protect } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

router.post('/', [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('message').trim().notEmpty().withMessage('Message required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const contact = await Contact.create(req.body);
    console.log('\n📩 NEW CONTACT MESSAGE:', contact.name, '-', contact.email);
    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const messages = await Contact.find().sort('-createdAt');
    res.json({ success: true, data: messages });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id/read', protect, async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
