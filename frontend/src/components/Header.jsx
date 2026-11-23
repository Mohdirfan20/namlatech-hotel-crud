import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Plus, Home, ChevronRight, Hotel, Compass } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  // Dynamic breadcrumb generation
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/') return [{ label: 'Home', to: '/' }, { label: 'Hotels', to: '/' }];
    if (path === '/manage') return [{ label: 'Home', to: '/' }, { label: 'Admin Console', to: '/manage' }, { label: 'Manage Listings', to: '/manage' }];
    if (path === '/add') return [{ label: 'Home', to: '/' }, { label: 'Hotels', to: '/' }, { label: 'Add New Hotel', to: '/add' }];
    if (path.startsWith('/edit/')) return [{ label: 'Home', to: '/' }, { label: 'Hotels', to: '/' }, { label: 'Edit Hotel', to: path }];
    if (path.startsWith('/hotels/')) return [{ label: 'Home', to: '/' }, { label: 'Hotels', to: '/' }, { label: 'Hotel Details', to: path }];
    return [{ label: 'Home', to: '/' }, { label: 'Hotels', to: '/' }];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200">
      {/* Top Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md group-hover:bg-blue-700 transition">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-gray-900 flex items-center">
                <span className="text-blue-600 font-extrabold mr-1">Namla</span>Tech
                <span className="ml-2 text-xs font-semibold uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Hotels</span>
              </span>
              <p className="text-xs text-gray-500 hidden sm:block">Global Hotel Management & Directory</p>
            </div>
          </Link>

          {/* Quick Nav / Add Hotel Button */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium rounded-md transition ${
                location.pathname === '/' ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Browse Directory
            </Link>
            <Link
              to="/manage"
              className={`px-3 py-2 text-sm font-medium rounded-md transition ${
                location.pathname === '/manage' ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Manage Hotels (Admin)
            </Link>
            <Link
              to="/add"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add New Hotel</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Blue Banner matching sample UI */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white py-6 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {location.pathname === '/add' ? 'Add New Hotel Listing' :
               location.pathname.startsWith('/edit') ? 'Update Hotel Information' :
               location.pathname.startsWith('/hotels') ? 'Hotel Overview & Location' :
               'Explore Premier Hotels & Resorts'}
            </h1>
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-xs sm:text-sm text-blue-100 mt-2">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.to + idx}>
                  {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-blue-300" />}
                  {idx === breadcrumbs.length - 1 ? (
                    <span className="font-semibold text-white">{crumb.label}</span>
                  ) : (
                    <Link to={crumb.to} className="hover:text-white hover:underline transition">
                      {crumb.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Banner Action Button */}
          {location.pathname !== '/add' && (
            <div>
              <Link
                to="/add"
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 text-sm font-semibold rounded-lg shadow transition transform active:scale-95"
              >
                <Plus className="w-4 h-4 text-blue-600" />
                <span>List New Hotel</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
