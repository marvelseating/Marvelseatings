import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiPhone } from 'react-icons/hi';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Products', to: '/products' },
  { label: 'Our Works', to: '/works' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [pathname]);

  const navBg = scrolled || !isHome
    ? 'bg-white shadow-md'
    : 'bg-transparent';
  const textColor = scrolled || !isHome ? 'text-gray-700' : 'text-white/90';
  const logoColor = scrolled || !isHome ? 'text-brand' : 'text-white';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      {/* Top bar */}
      <div className={`hidden md:flex items-center justify-end px-8 py-1 text-xs transition-all duration-300 ${scrolled || !isHome ? 'bg-brand text-white' : 'bg-white/10 text-white/80'}`}>
        <a href="tel:8045801616" className="flex items-center gap-1 hover:text-accent transition-colors">
          <HiPhone className="text-accent" />
          <span>8045801616</span>
        </a>
        <span className="mx-3 opacity-40">|</span>
        <span>No 1/638, Jalladianpet, Chennai - 600100</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold text-lg transition-all ${scrolled || !isHome ? 'bg-brand text-white' : 'bg-white/20 text-white border border-white/30'}`}>
              M
            </div>
            <div>
              <div className={`font-display font-bold text-lg leading-tight transition-colors ${logoColor}`}>
                Marvel Seating
              </div>
              <div className={`text-xs font-body transition-colors ${scrolled || !isHome ? 'text-accent' : 'text-accent-light'}`}>
                System
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-accent text-white'
                      : `${textColor} hover:text-brand hover:bg-brand/5`
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              className="ml-3 btn-primary text-sm py-2"
            >
              Get Quote
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled || !isHome ? 'text-brand' : 'text-white'}`}
          >
            {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-xl overflow-hidden"
          >
            <nav className="px-4 py-4 flex flex-col gap-1">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
                        isActive ? 'bg-brand text-white' : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
              <div className="pt-2 border-t border-gray-100 mt-2">
                <a href="tel:8045801616" className="flex items-center gap-2 px-4 py-3 text-sm text-brand font-medium">
                  <HiPhone /> 8045801616
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
