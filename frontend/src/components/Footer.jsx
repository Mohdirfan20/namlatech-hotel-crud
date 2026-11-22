import React from 'react';
import { Building2, Mail, Phone, MapPin, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 text-white mb-4">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                <span className="text-blue-500">Namla</span>Tech Hotels
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-4 max-w-sm leading-relaxed">
              Full-featured hotel management SPA built with React, Redux Toolkit, Node.js, Express, and PostgreSQL Native SQL queries. Providing responsive browsing, filtering, and geolocation capabilities.
            </p>
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-blue-400" /> Global Directory</span>
              <span className="flex items-center"><Globe className="w-3.5 h-3.5 mr-1 text-blue-400" /> Interactive Maps</span>
            </div>
          </div>

          {/* Directory Links */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">Directory</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="/" className="hover:text-white transition">All Hotels</a></li>
              <li><a href="/add" className="hover:text-white transition">Add New Hotel</a></li>
              <li><span className="text-slate-500">Luxury Resorts</span></li>
              <li><span className="text-slate-500">Boutique Stays</span></li>
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">Tech Stack</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><span className="text-slate-400">ReactJS + Redux Toolkit</span></li>
              <li><span className="text-slate-400">Node.js + Express API</span></li>
              <li><span className="text-slate-400">PostgreSQL Native SQL</span></li>
              <li><span className="text-slate-400">Leaflet & Geolocation</span></li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">Stay Updated</h4>
            <p className="text-xs text-slate-400 mb-3">Subscribe for the latest hospitality features and updates.</p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="Enter email address"
                className="w-full px-3 py-2 text-xs bg-slate-800 text-white rounded border border-slate-700 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="w-full px-3 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded transition"
              >
                Join Newsletter
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Namlatech India Private Limited. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
