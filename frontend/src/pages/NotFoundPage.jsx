import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
      <div className="text-center px-4">
        <div className="text-9xl font-display font-bold text-brand/10">404</div>
        <h1 className="font-display text-3xl font-bold text-brand -mt-6">Page Not Found</h1>
        <p className="text-gray-500 mt-3 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary">Go Back Home</Link>
      </div>
    </div>
  );
}
