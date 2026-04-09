const express = require('express');
const router = express.Router();
const { PriceRequest } = require('../models');
const { protect } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// POST submit price request (public)
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('productName').trim().notEmpty().withMessage('Product name is required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const request = await PriceRequest.create(req.body);

    // Console mock for email notification
    console.log('\n📬 NEW PRICE REQUEST RECEIVED:');
    console.log('================================');
    console.log(`Name:     ${request.name}`);
    console.log(`Phone:    ${request.phone}`);
    console.log(`Email:    ${request.email}`);
    console.log(`Product:  ${request.productName}`);
    console.log(`Model:    ${request.modelNumber || 'N/A'}`);
    console.log(`Quantity: ${request.quantity}`);
    console.log(`Message:  ${request.message || 'N/A'}`);
    console.log('================================\n');

    // Try to send email if nodemailer is configured
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        });
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: process.env.ADMIN_EMAIL,
          subject: `New Price Request - ${request.productName}`,
          html: `<h2>New Price Request</h2>
            <p><b>Name:</b> ${request.name}</p>
            <p><b>Phone:</b> ${request.phone}</p>
            <p><b>Email:</b> ${request.email}</p>
            <p><b>Product:</b> ${request.productName}</p>
            <p><b>Model:</b> ${request.modelNumber || 'N/A'}</p>
            <p><b>Quantity:</b> ${request.quantity}</p>
            <p><b>Message:</b> ${request.message || 'N/A'}</p>`
        });
      } catch (emailErr) {
        console.log('Email send failed (non-critical):', emailErr.message);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Price request submitted successfully! We will contact you soon.',
      data: { id: request._id }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Admin only ─────────────────────────────────────────

// GET all requests
router.get('/', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const requests = await PriceRequest.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await PriceRequest.countDocuments(query);
    res.json({ success: true, data: requests, total, page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update status
router.put('/:id', protect, async (req, res) => {
  try {
    const request = await PriceRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: request });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE
router.delete('/:id', protect, async (req, res) => {
  try {
    await PriceRequest.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Request deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
