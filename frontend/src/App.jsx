import { HashRouter as Router, Routes, Route } from 'react-router-dom';
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Public pages
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ModelDetailPage from './pages/ModelDetailPage';
import WorksPage from './pages/WorksPage';
import TestimonialsPage from './pages/TestimonialsPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin pages
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminWorks from './pages/admin/AdminWorks';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminRequests from './pages/admin/AdminRequests';
import AdminMessages from './pages/admin/AdminMessages';
import ProtectedRoute from './components/admin/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: 'DM Sans, sans-serif', fontSize: '14px' },
            success: { iconTheme: { primary: '#1e3a5f', secondary: '#fff' } },
            error: { iconTheme: { primary: '#e8722a', secondary: '#fff' } }
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:slug" element={<ProductDetailPage />} />
            <Route path="products/:slug/models/:modelNumber" element={<ModelDetailPage />} />
            <Route path="works" element={<WorksPage />} />
            <Route path="testimonials" element={<TestimonialsPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute><AdminLayout /></ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="works" element={<AdminWorks />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="requests" element={<AdminRequests />} />
            <Route path="messages" element={<AdminMessages />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
