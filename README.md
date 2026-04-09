# Marvel Seating System — Full Stack Website

A production-level business website for Marvel Seating System, Chennai.  
Built with **React + Vite** (frontend), **Node.js + Express** (backend), **MongoDB** (database), and **Tailwind CSS**.

---

## 🗂️ Project Structure

```
marvel-seating/
├── frontend/          ← React + Vite + Tailwind CSS
│   └── src/
│       ├── pages/         ← Public pages + Admin pages
│       ├── components/    ← Navbar, Footer, UI, Admin Layout
│       ├── context/       ← Auth context (JWT)
│       └── utils/         ← API utility (axios)
│
├── backend/           ← Node.js + Express REST API
│   ├── models/        ← Mongoose schemas
│   ├── routes/        ← API route handlers
│   ├── middleware/    ← Auth (JWT) + Upload (Cloudinary/local)
│   └── scripts/       ← Database seed script
│
├── start.sh           ← Mac/Linux one-click launcher
└── start.bat          ← Windows one-click launcher
```

---

## ⚙️ Prerequisites

- **Node.js** v18+ — https://nodejs.org
- **MongoDB** — https://www.mongodb.com/try/download/community (local) or MongoDB Atlas (cloud)
- **Git** (optional)

---

## 🚀 Quick Start

### Option 1: One-Click Launchers

**Mac / Linux:**
```bash
chmod +x start.sh
./start.sh
```

**Windows:**
Double-click `start.bat`

---

### Option 2: Manual Setup

#### 1. Set up the Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and other settings
npm run seed          # Seeds demo data + creates admin user
npm run dev           # Starts backend at http://localhost:5000
```

#### 2. Set up the Frontend

```bash
cd frontend
npm install
npm run dev           # Starts frontend at http://localhost:5173
```

---

## 🌐 URLs

| URL | Description |
|-----|-------------|
| http://localhost:5173 | Public website |
| http://localhost:5173/admin | Admin panel |
| http://localhost:5000/api/health | API health check |

---

## 🔐 Admin Login

After running seed:
- **Email:** admin@marvelseating.com  
- **Password:** Marvel@2024

> ⚠️ Change these in production!

---

## 🌍 Environment Variables (backend/.env)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/marvel_seating
JWT_SECRET=your_strong_secret_here
JWT_EXPIRE=7d

# Optional: Cloudinary (for cloud image storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: Email notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
ADMIN_EMAIL=admin@marvelseating.com

NODE_ENV=development
```

---

## 📦 Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS 3 (custom brand colors)
- Framer Motion (animations)
- React Router DOM v6
- Swiper.js (testimonial carousel)
- React Hot Toast (notifications)
- React Icons

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (file uploads)
- Cloudinary SDK (optional)
- Express Validator
- Nodemailer (optional email)

---

## 📋 API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/categories | All product categories |
| GET | /api/products | All products (supports ?featured=true&limit=N) |
| GET | /api/products/:slug | Single product |
| GET | /api/products/:slug/models/:modelNumber | Single model |
| POST | /api/price-requests | Submit price request |
| GET | /api/works | Completed projects |
| GET | /api/testimonials | Client reviews |
| POST | /api/contact | Send contact message |

### Admin (Bearer JWT required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/admin/login | Admin login |
| GET | /api/admin/me | Get current admin |
| GET | /api/admin/dashboard | Dashboard stats |
| POST/PUT/DELETE | /api/products | Manage products |
| POST | /api/products/:id/models | Add model |
| DELETE | /api/products/:id/models/:modelId | Remove model |
| GET/PUT/DELETE | /api/price-requests | Manage enquiries |
| POST/PUT/DELETE | /api/works | Manage projects |
| POST/PUT/DELETE | /api/testimonials | Manage reviews |
| GET | /api/contact | View messages |

---

## 🖼️ Image Storage

- **Development:** Images stored in `backend/uploads/images/`
- **Production:** Configure Cloudinary in `.env` for cloud storage

---

## 🚢 Deployment Guide

### Backend (Railway / Render / VPS)

1. Set all environment variables
2. Set `MONGO_URI` to MongoDB Atlas connection string
3. Set `NODE_ENV=production`
4. Deploy backend folder
5. Run seed: `npm run seed`

### Frontend (Vercel / Netlify)

1. Update `vite.config.js` proxy OR set `VITE_API_URL` env variable
2. Build: `npm run build`
3. Deploy `dist/` folder
4. Set `CORS` in backend to allow your frontend domain

### MongoDB Atlas (Free Cloud DB)
1. Go to https://cloud.mongodb.com
2. Create free M0 cluster
3. Get connection string → set as `MONGO_URI`

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Brand (Navy) | #1e3a5f |
| Accent (Orange) | #e8722a |
| Dark Navy | #0f1f33 |
| Fonts | Playfair Display (headings) + DM Sans (body) |

---

## 📞 Company Info

- **Marvel Seating System** — Founded 2006
- **Address:** No 1/638, Veerathamman Koil Street, Jalladianpet, Chennai - 600100
- **Phone:** 8045801616
- **GST:** 33AJWPR8444C2ZR
- **Proprietor:** Mr. Rajesh Kumar
