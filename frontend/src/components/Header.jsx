import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Building2, Plus, ChevronRight, Search, X, Loader2, MapPin, Star } from 'lucide-react';
import { setSearch, fetchHotels } from '../redux/hotelSlice';
import { hotelApi, getImageUrl } from '../services/api';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close suggestions dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch live autocomplete suggestions while typing even a single letter
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const res = await hotelApi.getHotels({ search: trimmed, limit: 5 });
        setSuggestions(res.data || []);
        setShowDropdown(true);
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle search submission (Enter or button click)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowDropdown(false);
    dispatch(setSearch(searchQuery.trim()));
    dispatch(fetchHotels());
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  // Clear search field
  const handleClearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    dispatch(setSearch(''));
    dispatch(fetchHotels());
  };

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
    <header className="w-full bg-white shadow-xs border-b border-gray-200">
      {/* Top Navbar (Red, White & Black) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md group-hover:bg-red-700 transition">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-black flex items-center">
                <span className="text-red-600 mr-1">Namla</span>Tech
                <span className="ml-2 text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded">Hotels</span>
              </span>
              <p className="text-[11px] text-gray-500 hidden sm:block font-medium">Global Hotel Management & Directory</p>
            </div>
          </Link>

          {/* Top Right: Admin Management & Add Hotel */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              to="/manage"
              className={`px-3 py-2 text-xs font-bold rounded-lg transition ${
                location.pathname === '/manage'
                  ? 'text-red-700 bg-red-50 border border-red-200'
                  : 'text-gray-700 hover:text-black hover:bg-gray-100'
              }`}
            >
              Manage Hotels (Admin)
            </Link>
            <Link
              to="/add"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-xs transition transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add New Hotel</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Red, White & Black Banner with Search Bar in Right Corner */}
      <div className="bg-gradient-to-r from-black via-zinc-900 to-red-950 text-white py-6 px-4 sm:px-6 lg:px-8 shadow-inner border-b border-red-900/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          {/* Left: Title & Breadcrumbs */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {location.pathname === '/add' ? 'Add New Hotel Listing' :
               location.pathname.startsWith('/edit') ? 'Update Hotel Information' :
               location.pathname.startsWith('/hotels') ? 'Hotel Overview & Location' :
               location.pathname === '/manage' ? 'Hotel Management & CRUD Console' :
               'Explore Premier Hotels & Resorts'}
            </h1>
            <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-400 mt-2">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.to + idx}>
                  {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-500" />}
                  {idx === breadcrumbs.length - 1 ? (
                    <span className="font-bold text-white">{crumb.label}</span>
                  ) : (
                    <Link to={crumb.to} className="hover:text-red-400 hover:underline transition">
                      {crumb.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Right Corner: Live Autocomplete Search Bar */}
          <div ref={dropdownRef} className="relative w-full md:w-80 lg:w-96 flex-shrink-0">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search hotels by name, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                  className="w-full pl-4 pr-20 py-2.5 text-xs bg-white text-black placeholder-gray-400 rounded-xl shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-600 transition font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-black rounded-full"
                    title="Clear"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                {isLoadingSuggestions && (
                  <div className="absolute right-12 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="absolute right-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1 shadow-xs transition"
                title="Search Hotels"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </form>

            {/* Live Autocomplete Suggestions Dropdown */}
            {showDropdown && searchQuery.trim() && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150 text-gray-800">
                <div className="p-2.5 bg-zinc-900 text-white border-b border-zinc-800 flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
                  <span className="text-red-400">Suggested Hotels ({suggestions.length})</span>
                  <span className="text-gray-400">Press Enter to search all</span>
                </div>

                {suggestions.length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-500 font-medium">
                    No hotels found matching "{searchQuery}"
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                    {suggestions.map((hotel) => (
                      <Link
                        key={hotel.id}
                        to={`/hotels/${hotel.id}`}
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center space-x-3 p-3 hover:bg-red-50/70 transition group text-left"
                      >
                        <img
                          src={getImageUrl(hotel.image_path)}
                          alt={hotel.title}
                          className="w-11 h-11 rounded-lg object-cover flex-shrink-0 border border-gray-200 shadow-2xs"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-black group-hover:text-red-600 transition truncate">
                            {hotel.title}
                          </p>
                          <div className="flex items-center space-x-2 text-[10px] text-gray-500 mt-0.5 font-medium">
                            <span className="flex items-center text-amber-500 font-bold">
                              <Star className="w-3 h-3 fill-amber-400 mr-0.5" /> 4.8
                            </span>
                            <span>•</span>
                            <span className="flex items-center font-mono text-gray-400">
                              <MapPin className="w-3 h-3 mr-0.5 text-red-600" />
                              {Number(hotel.latitude).toFixed(2)}°, {Number(hotel.longitude).toFixed(2)}°
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-xs font-black text-red-600 block">
                            ${Number(hotel.price).toFixed(2)}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">/ night</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                <div className="p-2 bg-gray-50 border-t border-gray-100 text-center">
                  <button
                    type="button"
                    onClick={handleSearchSubmit}
                    className="text-xs font-bold text-red-600 hover:text-red-800 transition"
                  >
                    View all matching results for "{searchQuery}" →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
