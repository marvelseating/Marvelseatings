import { Link } from 'react-router-dom';
import { HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi';
import { FaWhatsapp, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center font-display font-bold text-lg">M</div>
            <div>
              <div className="font-display font-bold text-lg leading-tight">Marvel Seating</div>
              <div className="text-accent text-xs">System</div>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            Manufacturer, Supplier & Trader of premium office chairs and furniture solutions in Chennai since 2006.
          </p>
          <div className="flex gap-3">
            {[
              { icon: FaWhatsapp, href: 'https://wa.me/918045801616', label: 'WhatsApp' },
              { icon: FaFacebook, href: '#', label: 'Facebook' },
              { icon: FaInstagram, href: '#', label: 'Instagram' },
              { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
            ].map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-accent rounded-lg flex items-center justify-center transition-colors duration-200"
                aria-label={label}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-display font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {[
              { label: 'Home', to: '/' },
              { label: 'About Us', to: '/about' },
              { label: 'Products', to: '/products' },
              { label: 'Our Works', to: '/works' },
              { label: 'Testimonials', to: '/testimonials' },
              { label: 'Contact Us', to: '/contact' },
            ].map(({ label, to }) => (
              <li key={to}>
                <Link to={to} className="text-gray-400 hover:text-accent text-sm transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-display font-semibold text-lg mb-4">Our Services</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            {[
              'Office Chair Servicing',
              'Blinds & Carpet Cleaning',
              'Sofa Rework & Reupholstery',
              'Carpentry Work',
              'Bulk Order Supply',
              'Custom Furniture',
            ].map(s => (
              <li key={s} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-accent rounded-full shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-display font-semibold text-lg mb-4">Contact Us</h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <HiLocationMarker className="text-accent mt-0.5 shrink-0 w-5 h-5" />
              <span>No 1/638, Veerathamman Koil Street, St. John's School Road, Jalladianpet, Chennai - 600100</span>
            </li>
            <li>
              <a href="tel:8045801616" className="flex items-center gap-3 hover:text-accent transition-colors">
                <HiPhone className="text-accent w-5 h-5" />
                8045801616
              </a>
            </li>
            <li>
              <a href="mailto:info@marvelseating.com" className="flex items-center gap-3 hover:text-accent transition-colors">
                <HiMail className="text-accent w-5 h-5" />
                info@marvelseating.com
              </a>
            </li>
          </ul>
          <div className="mt-5 p-3 bg-white/5 rounded-lg text-xs text-gray-500 space-y-1">
            <div><span className="text-gray-400">GST:</span> 33AJWPR8444C2ZR</div>
            <div><span className="text-gray-400">Est:</span> 2006</div>
            <div><span className="text-gray-400">Proprietor:</span> Mr. Rajesh Kumar</div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Marvel Seating System. All rights reserved.</p>
          <p>Manufacturer | Supplier | Trader · Chennai, Tamil Nadu, India</p>
        </div>
      </div>
    </footer>
  );
}
