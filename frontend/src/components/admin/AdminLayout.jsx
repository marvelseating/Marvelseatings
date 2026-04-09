import { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiViewGrid, HiShoppingBag, HiPhotograph, HiStar,
  HiInbox, HiMail, HiLogout, HiMenu, HiX, HiExternalLink
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin', icon: HiViewGrid, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: HiShoppingBag, label: 'Products' },
  { to: '/admin/works', icon: HiPhotograph, label: 'Our Works' },
  { to: '/admin/testimonials', icon: HiStar, label: 'Testimonials' },
  { to: '/admin/requests', icon: HiInbox, label: 'Price Requests' },
  { to: '/admin/messages', icon: HiMail, label: 'Messages' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center font-display font-bold text-white">M</div>
          <div>
            <div className="font-display font-bold text-white text-sm leading-tight">Marvel Seating</div>
            <div className="text-white/40 text-xs">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-accent text-white shadow-lg shadow-accent/30'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <Icon className="w-5 h-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <Link to="/" target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 text-sm transition-all">
          <HiExternalLink className="w-4 h-4" /> View Website
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:text-white hover:bg-red-500/20 text-sm transition-all">
          <HiLogout className="w-4 h-4" /> Logout
        </button>
        <div className="px-4 pt-3 flex items-center gap-2">
          <div className="w-7 h-7 bg-accent/30 rounded-full flex items-center justify-center text-accent font-bold text-xs">
            {admin?.name?.[0] || 'A'}
          </div>
          <div>
            <div className="text-white text-xs font-medium">{admin?.name}</div>
            <div className="text-white/40 text-xs">{admin?.role}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-body overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-brand-dark shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-60 bg-brand-dark z-50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center gap-4 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-brand">
            <HiMenu className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="font-display font-bold text-brand text-lg">Admin Panel</h1>
          </div>
          <span className="text-sm text-gray-500 hidden sm:block">Welcome, {admin?.name}</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
