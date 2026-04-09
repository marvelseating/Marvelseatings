const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
   origin: [
    "http://localhost:5173",
    "https://neevan-7.github.io"
  ],
 // origin: process.env.NODE_ENV === 'production' ? 'https://yoursite.com' : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for local uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/price-requests', require('./routes/priceRequests'));
app.use('/api/works', require('./routes/works'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));

// Seed route (for development/testing only)
app.get("/api/seed", async (req, res) => {
  try {
    const seed = require("./scripts/seed");
    await seed();
    res.send("Database seeded!");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Marvel Seating API running', timestamp: new Date() });
});


// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Connect DB and start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/marvel_seating')
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT,"0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      //console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;
