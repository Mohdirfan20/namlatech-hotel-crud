import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchHotels, setPage, setSearch, deleteHotel, clearSuccessNotification } from '../redux/hotelSlice';
import { getImageUrl } from '../services/api';
import { DeleteConfirmModal, SuccessPopup } from '../components/SuccessModal';
import Pagination from '../components/Pagination';
import { Plus, Edit3, Trash2, Search, ExternalLink, ShieldAlert, SlidersHorizontal, RefreshCw, Building } from 'lucide-react';

const AdminManagePage = () => {
  const dispatch = useDispatch();
  const { hotels, total, pagination, filters, loading, successNotification } = useSelector(
    (state) => state.hotels
  );

  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [hotelToDelete, setHotelToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch, pagination.page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearch(searchInput));
    dispatch(fetchHotels());
  };

  const handleConfirmDelete = async () => {
    if (!hotelToDelete) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteHotel({ id: hotelToDelete.id, deleteImage: true })).unwrap();
      setHotelToDelete(null);
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Helmet>
        <title>Hotel Management Console (Admin CRUD) | Namlatech</title>
        <meta name="description" content="Dedicated administrative module for adding, updating, and deleting hotel records." />
      </Helmet>

      {successNotification && (
        <SuccessPopup
          message={successNotification}
          onClose={() => dispatch(clearSuccessNotification())}
        />
      )}

      <DeleteConfirmModal
        isOpen={Boolean(hotelToDelete)}
        hotel={hotelToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setHotelToDelete(null)}
        isDeleting={isDeleting}
      />

      {/* Module Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Dedicated Administration Module</span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Hotel Management & CRUD Console
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Separate administrative module for hotel managers & developers to create, update, and delete listings.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/add"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm transition transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Hotel</span>
            </Link>
          </div>
        </div>

        {/* Search & Stats Bar */}
        <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full flex space-x-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search hotels to manage..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition"
            >
              Filter
            </button>
          </form>

          <div className="text-xs font-medium text-gray-500 flex items-center space-x-2">
            <span>Total Listings: <strong className="text-gray-900">{total}</strong></span>
            <span>•</span>
            <button
              onClick={() => dispatch(fetchHotels())}
              className="inline-flex items-center space-x-1 text-blue-600 hover:underline"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Management Table / Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200 font-semibold">
              <tr>
                <th scope="col" className="px-6 py-4">Property</th>
                <th scope="col" className="px-6 py-4">Price / Night</th>
                <th scope="col" className="px-6 py-4">Coordinates</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-xs">Loading management records...</p>
                  </td>
                </tr>
              ) : hotels.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No hotel records found matching your query.
                  </td>
                </tr>
              ) : (
                hotels.map((hotel) => (
                  <tr key={hotel.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={getImageUrl(hotel.image_path)}
                          alt={hotel.title}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        <div className="min-w-0">
                          <Link
                            to={`/hotels/${hotel.id}`}
                            className="font-bold text-gray-900 hover:text-blue-600 transition truncate block"
                          >
                            {hotel.title}
                          </Link>
                          <span className="text-xs text-gray-400">ID: #{hotel.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-gray-900">
                      ${Number(hotel.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-500">
                      {Number(hotel.latitude).toFixed(3)}°, {Number(hotel.longitude).toFixed(3)}°
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/hotels/${hotel.id}`}
                          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                          title="View Details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/edit/${hotel.id}`}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold rounded-lg transition shadow-2xs"
                          title="Edit Hotel Record"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => setHotelToDelete(hotel)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-lg transition shadow-2xs"
                          title="Delete Hotel Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination in Admin module */}
        <div className="p-4 border-t border-gray-100">
          <Pagination
            total={total}
            limit={pagination.limit}
            offset={pagination.offset}
            onPageChange={(p) => dispatch(setPage(p))}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminManagePage;
