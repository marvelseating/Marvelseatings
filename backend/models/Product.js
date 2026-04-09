const mongoose = require('mongoose');

const ModelSchema = new mongoose.Schema({
  modelNumber: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  specifications: [{
    key: { type: String },
    value: { type: String }
  }],
  tags: [String],
  isAvailable: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  coverImage: { type: String },
  models: [ModelSchema],
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Auto-generate slug
ProductSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
