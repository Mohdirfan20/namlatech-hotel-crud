import React from 'react';
import { Building2, Mail, Phone, MapPin, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-zinc-300 pt-12 pb-8 border-t border-zinc-900 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 text-white mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight">
                <span className="text-red-600">Namla</span>Tech Hotels
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-4 max-w-sm leading-relaxed">
              Full-featured hotel management SPA built with React, Redux Toolkit, Node.js, Express, and PostgreSQL Native SQL queries.
            </p>
            <div className="flex items-center space-x-3 text-xs text-zinc-400 font-medium">
              <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-red-600" /> Global Directory</span>
              <span className="flex items-center"><Globe className="w-3.5 h-3.5 mr-1 text-red-600" /> Interactive Maps</span>
            </div>
          </div>

          {/* Directory Links */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider mb-3">Directory</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><a href="/" className="hover:text-red-500 transition">All Hotels</a></li>
              <li><a href="/manage" className="hover:text-red-500 transition">Manage Listings (Admin)</a></li>
              <li><a href="/add" className="hover:text-red-500 transition">Add New Hotel</a></li>
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider mb-3">Tech Stack</h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-medium">
              <li><span>ReactJS + Redux Toolkit</span></li>
              <li><span>Node.js + Express API</span></li>
              <li><span>PostgreSQL Native SQL</span></li>
              <li><span>Leaflet & Geolocation</span></li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider mb-3">Stay Updated</h4>
            <p className="text-xs text-zinc-400 mb-3">Subscribe for the latest updates and property releases.</p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="Enter email address"
                className="w-full px-3 py-2 text-xs bg-zinc-900 text-white rounded-lg border border-zinc-800 focus:outline-none focus:border-red-600"
              />
              <button
                type="submit"
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© 2026 NamlaTech India Private Limited. All rights reserved.</p>
          <div className="flex space-x-6 text-zinc-500">
            <span className="hover:text-zinc-300 transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-300 transition cursor-pointer">Terms of Service</span>
            <span className="hover:text-zinc-300 transition cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
