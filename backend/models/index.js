const mongoose = require('mongoose');

// ─── Category ────────────────────────────────────────
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  icon: { type: String },
  image: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// ─── Price Request ────────────────────────────────────
const PriceRequestSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  productName: { type: String, required: true },
  modelNumber: { type: String },
  quantity: { type: Number, default: 1, min: 1 },
  message: { type: String },
  status: {
    type: String,
    enum: ['new', 'viewed', 'contacted', 'closed'],
    default: 'new'
  },
  adminNotes: { type: String }
}, { timestamps: true });

// ─── Work/Project ─────────────────────────────────────
const WorkSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  projectTitle: { type: String, required: true },
  description: { type: String },
  images: [{ type: String }],
  category: { type: String },
  completedAt: { type: Date },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// ─── Testimonial ──────────────────────────────────────
const TestimonialSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  company: { type: String },
  designation: { type: String },
  review: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  avatar: { type: String },
  isActive: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// ─── Contact Message ──────────────────────────────────
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

// ─── Admin User ───────────────────────────────────────
const bcrypt = require('bcryptjs');
const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'admin'], default: 'admin' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

AdminSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = {
  Category: mongoose.model('Category', CategorySchema),
  PriceRequest: mongoose.model('PriceRequest', PriceRequestSchema),
  Work: mongoose.model('Work', WorkSchema),
  Testimonial: mongoose.model('Testimonial', TestimonialSchema),
  Contact: mongoose.model('Contact', ContactSchema),
  Admin: mongoose.model('Admin', AdminSchema)
};
