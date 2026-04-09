const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Admin, PriceRequest, Contact } = require('../models');
const { protect } = require('../middleware/auth');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'marvel_secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password required' });

  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.matchPassword(password)))
    return res.status(401).json({ success: false, message: 'Invalid credentials' });

  res.json({
    success: true,
    token: signToken(admin._id),
    admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }
  });
});

// GET /api/admin/me
router.get('/me', protect, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

// GET /api/admin/dashboard - stats
router.get('/dashboard', protect, async (req, res) => {
  try {
    const [totalRequests, newRequests, unreadMessages] = await Promise.all([
      PriceRequest.countDocuments(),
      PriceRequest.countDocuments({ status: 'new' }),
      Contact.countDocuments({ isRead: false })
    ]);
    res.json({
      success: true,
      data: { totalRequests, newRequests, unreadMessages }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/create (only in dev or by superadmin)
router.post('/create', async (req, res) => {
  try {
    const existing = await Admin.findOne({ email: req.body.email });
    if (existing) return res.status(400).json({ success: false, message: 'Admin already exists' });
    const admin = await Admin.create(req.body);
    res.status(201).json({
      success: true,
      token: signToken(admin._id),
      admin: { id: admin._id, name: admin.name, email: admin.email }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
