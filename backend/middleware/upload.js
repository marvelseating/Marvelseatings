const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ─── Local Storage (fallback) ─────────────────────────
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', 'images');
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// ─── Cloudinary Storage (if configured) ──────────────
let uploadMiddleware;

if (process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET) {
  try {
    const cloudinary = require('cloudinary').v2;
    const { CloudinaryStorage } = require('multer-storage-cloudinary');

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const cloudStorage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'marvel-seating',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [{ width: 1200, height: 900, crop: 'limit', quality: 'auto' }]
      }
    });

    uploadMiddleware = multer({ storage: cloudStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
    console.log('✅ Using Cloudinary storage');
  } catch (err) {
    console.log('⚠️  Cloudinary unavailable, falling back to local storage');
    uploadMiddleware = multer({ storage: localStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
  }
} else {
  uploadMiddleware = multer({ storage: localStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
  console.log('ℹ️  Using local file storage (configure Cloudinary in .env for production)');
}

module.exports = uploadMiddleware;
