#!/bin/bash

# ─── Marvel Seating System — One-Click Launcher ───────
echo ""
echo "╔════════════════════════════════════════╗"
echo "║    Marvel Seating System Launcher      ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js is not installed. Install it from https://nodejs.org"
  exit 1
fi
echo "✅ Node.js: $(node -v)"

# Check MongoDB
if ! command -v mongod &> /dev/null; then
  echo "⚠️  MongoDB not found locally. Make sure your MONGO_URI in backend/.env points to a running instance."
else
  echo "✅ MongoDB found"
fi

# ── Setup Backend ──────────────────────────────────────
echo ""
echo "📦 Setting up backend..."
cd backend

if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "✅ Created backend/.env from template"
  echo "ℹ️  Edit backend/.env if you need to change MongoDB URI or other settings"
fi

npm install --silent
echo "✅ Backend dependencies installed"

echo "🌱 Seeding database..."
node scripts/seed.js

# ── Setup Frontend ─────────────────────────────────────
echo ""
echo "📦 Setting up frontend..."
cd ../frontend
npm install --silent
echo "✅ Frontend dependencies installed"

# ── Launch both servers ────────────────────────────────
echo ""
echo "🚀 Starting servers..."
echo ""
cd ..

# Start backend
(cd backend && npm run dev) &
BACKEND_PID=$!

sleep 2

# Start frontend
(cd frontend && npm run dev) &
FRONTEND_PID=$!

sleep 3

echo ""
echo "╔════════════════════════════════════════╗"
echo "║        ✅ All Systems Running!         ║"
echo "╠════════════════════════════════════════╣"
echo "║  Website:  http://localhost:5173       ║"
echo "║  Admin:    http://localhost:5173/admin ║"
echo "║  API:      http://localhost:5000/api   ║"
echo "╠════════════════════════════════════════╣"
echo "║  Admin Login:                          ║"
echo "║  Email: admin@marvelseating.com        ║"
echo "║  Pass:  Marvel@2024                    ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "Press Ctrl+C to stop all servers."

# Wait for interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo ''; echo '🛑 Servers stopped.'; exit 0" SIGINT SIGTERM
wait
