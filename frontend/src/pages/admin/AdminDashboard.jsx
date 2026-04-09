import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiShoppingBag, HiInbox, HiMail, HiPhotograph, HiStar, HiArrowRight } from 'react-icons/hi';
import { getDashboard, getPriceRequests } from '../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalRequests: 0, newRequests: 0, unreadMessages: 0 });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboard(), getPriceRequests({ limit: 5 })])
      .then(([dashRes, reqRes]) => {
        setStats(dashRes.data.data);
        setRecentRequests(reqRes.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Price Requests', value: stats.totalRequests, icon: HiInbox, color: 'bg-blue-500', to: '/admin/requests' },
    { label: 'New Requests', value: stats.newRequests, icon: HiShoppingBag, color: 'bg-accent', to: '/admin/requests' },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: HiMail, color: 'bg-green-500', to: '/admin/messages' },
  ];

  const quickLinks = [
    { label: 'Manage Products', to: '/admin/products', icon: HiShoppingBag, desc: 'Add, edit or remove products and models' },
    { label: 'Our Works', to: '/admin/works', icon: HiPhotograph, desc: 'Showcase completed projects' },
    { label: 'Testimonials', to: '/admin/testimonials', icon: HiStar, desc: 'Manage client reviews' },
    { label: 'Price Requests', to: '/admin/requests', icon: HiInbox, desc: 'View and respond to enquiries' },
  ];

  const statusColors = {
    new: 'bg-blue-100 text-blue-700',
    viewed: 'bg-yellow-100 text-yellow-700',
    contacted: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Overview of your Marvel Seating admin panel</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {statCards.map((card, i) => (
          <motion.div key={card.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          >
            <Link to={card.to} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow block">
              <div className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-gray-800">
                  {loading ? <div className="skeleton h-7 w-10 rounded" /> : card.value}
                </div>
                <div className="text-gray-500 text-sm">{card.label}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Requests */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-display font-bold text-gray-800">Recent Price Requests</h3>
            <Link to="/admin/requests" className="text-brand text-sm font-medium flex items-center gap-1 hover:text-accent transition-colors">
              View all <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}
            </div>
          ) : recentRequests.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <HiInbox className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>No requests yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentRequests.map(req => (
                <div key={req._id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 bg-brand/10 rounded-full flex items-center justify-center text-brand font-bold text-sm shrink-0">
                    {req.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 text-sm truncate">{req.name}</div>
                    <div className="text-gray-400 text-xs truncate">{req.productName} {req.modelNumber && `· ${req.modelNumber}`}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`badge text-xs ${statusColors[req.status] || statusColors.new}`}>
                      {req.status}
                    </span>
                    <div className="text-gray-400 text-xs mt-0.5">
                      {new Date(req.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-display font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {quickLinks.map(({ label, to, icon: Icon, desc }) => (
              <Link key={to} to={to}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-9 h-9 bg-brand/10 rounded-lg flex items-center justify-center group-hover:bg-brand/20 transition-colors">
                  <Icon className="w-4 h-4 text-brand" />
                </div>
                <div>
                  <div className="font-medium text-gray-700 text-sm">{label}</div>
                  <div className="text-gray-400 text-xs">{desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
