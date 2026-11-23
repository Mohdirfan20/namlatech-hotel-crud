import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Hotel, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <Helmet>
        <title>Page Not Found | Namlatech Hotels</title>
      </Helmet>
      <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto mb-4">
        <Hotel className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-black mb-2">404</h1>
      <h2 className="text-lg font-bold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-sm text-gray-500 mb-6 font-medium">
        The page or hotel directory listing you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center space-x-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition"
      >
        <Home className="w-4 h-4" />
        <span>Return to Hotel Directory</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
