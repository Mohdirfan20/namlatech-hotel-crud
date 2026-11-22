import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchHotels, setPage, deleteHotel, clearSuccessNotification, clearError } from '../redux/hotelSlice';
import FilterSidebar from '../components/FilterSidebar';
import HotelCard from '../components/HotelCard';
import Pagination from '../components/Pagination';
import { DeleteConfirmModal, SuccessPopup } from '../components/SuccessModal';
import { Hotel, AlertCircle, RefreshCw, Layers } from 'lucide-react';

const HotelListPage = () => {
  const dispatch = useDispatch();
  const { hotels, total, pagination, filters, loading, error, successNotification } = useSelector(
    (state) => state.hotels
  );

  const [hotelToDelete, setHotelToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch hotels on initial load and when page changes
  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch, pagination.page]);

  // Handle page change
  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Trigger Delete confirmation
  const handleDeletePrompt = (hotel) => {
    setHotelToDelete(hotel);
  };

  // Confirm deletion
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
      {/* Dynamic SEO Meta Tags via React Helmet */}
      <Helmet>
        <title>Explore Luxury Hotels & Resorts | Namlatech Directory</title>
        <meta
          name="description"
          content="Discover world-class luxury hotels, boutique stays, and beach resorts. Filter by name, price range, and view real-time locations on interactive maps."
        />
        <meta property="og:title" content="Explore Luxury Hotels & Resorts | Namlatech Directory" />
        <meta
          property="og:description"
          content="Find and manage premier hotels worldwide with responsive UI and Native SQL backend."
        />
      </Helmet>

      {/* Global Success Notification / Toast */}
      {successNotification && (
        <SuccessPopup
          message={successNotification}
          onClose={() => dispatch(clearSuccessNotification())}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(hotelToDelete)}
        hotel={hotelToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setHotelToDelete(null)}
        isDeleting={isDeleting}
      />

      {/* Two Column Layout: Left Filter Sidebar, Right Main List Area */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sidebar */}
        <FilterSidebar />

        {/* Right Main Content */}
        <main className="flex-1 w-full">
          {/* Main List Top Bar matching sample UI */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold text-gray-900">
                {loading ? 'Searching hotels...' : `${total} Hotels found`}
              </span>
              {(filters.search || filters.minPrice || filters.maxPrice) && (
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  Filtered
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <span className="flex items-center">
                <Layers className="w-3.5 h-3.5 mr-1 text-gray-400" /> Showing {hotels.length} of {total}
              </span>
              <button
                onClick={() => dispatch(fetchHotels())}
                className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition"
                title="Refresh list"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-xs text-red-700">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => dispatch(clearError())}
                className="text-xs font-semibold underline hover:text-red-900"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && hotels.length === 0 ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-xl p-5 border border-gray-200 animate-pulse flex flex-col md:flex-row gap-5">
                  <div className="md:w-64 h-48 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-3 py-2">
                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="md:w-48 h-32 bg-gray-100 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : hotels.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <Hotel className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No hotels found</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                We couldn't find any hotels matching your current search and price filter criteria. Try adjusting your filters.
              </p>
            </div>
          ) : (
            /* Vertical stack of Horizontal Hotel Cards */
            <div className="space-y-4">
              {hotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  onDeleteClick={handleDeletePrompt}
                />
              ))}
            </div>
          )}

          {/* Bottom Pagination Component */}
          <Pagination
            currentPage={pagination.page}
            totalItems={total}
            pageSize={pagination.limit}
            onPageChange={handlePageChange}
          />
        </main>
      </div>
    </div>
  );
};

export default HotelListPage;
