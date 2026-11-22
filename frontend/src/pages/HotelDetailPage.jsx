import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchHotelById, deleteHotel, clearSuccessNotification } from '../redux/hotelSlice';
import { getImageUrl } from '../services/api';
import HotelMap from '../components/HotelMap';
import { DeleteConfirmModal, SuccessPopup } from '../components/SuccessModal';
import { ArrowLeft, Edit3, Trash2, MapPin, DollarSign, Star, Calendar, ShieldCheck, Wifi, Coffee, Sparkles } from 'lucide-react';

const HotelDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedHotel, detailLoading, error, successNotification } = useSelector(
    (state) => state.hotels
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchHotelById(id));
    }
  }, [dispatch, id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteHotel({ id, deleteImage: true })).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (detailLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm text-gray-500 font-medium">Loading hotel details...</p>
      </div>
    );
  }

  if (error || !selectedHotel) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8">
          <h2 className="text-xl font-bold text-red-700 mb-2">Hotel Not Found</h2>
          <p className="text-sm text-red-600 mb-6">
            {error || "The hotel you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(selectedHotel.image_path);
  const formattedPrice = Number(selectedHotel.price).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dynamic SEO Tags */}
      <Helmet>
        <title>{`${selectedHotel.title} | Luxury Hotel Stays | Namlatech`}</title>
        <meta
          name="description"
          content={`${selectedHotel.title}: ${selectedHotel.description.substring(0, 150)}...`}
        />
        <meta property="og:title" content={`${selectedHotel.title} - Book Your Stay`} />
        <meta property="og:description" content={selectedHotel.description.substring(0, 200)} />
        <meta property="og:image" content={imageUrl} />
      </Helmet>

      {/* Success Popup */}
      {successNotification && (
        <SuccessPopup
          message={successNotification}
          onClose={() => dispatch(clearSuccessNotification())}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        hotel={selectedHotel}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isDeleting={isDeleting}
      />

      {/* Top Navigation & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Hotels</span>
        </Link>

        <div className="flex items-center space-x-3">
          <Link
            to={`/edit/${selectedHotel.id}`}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Edit Hotel</span>
          </Link>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
            <span>Delete Hotel</span>
          </button>
        </div>
      </div>

      {/* Hotel Showcase Hero Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Full Image with Descriptive Alt Tag */}
        <div className="relative h-72 sm:h-96 md:h-[420px] w-full bg-gray-900 overflow-hidden">
          <img
            src={imageUrl}
            alt={`Detailed exterior and resort architectural view of ${selectedHotel.title}`}
            className="w-full h-full object-cover opacity-95 hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          {/* Hero text overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-blue-600 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">
                Premier Listing
              </span>
              <div className="flex items-center text-amber-400 text-xs font-semibold bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded">
                <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" /> 4.9 Superb
              </div>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md">
              {selectedHotel.title}
            </h1>
            <div className="flex items-center space-x-3 text-xs sm:text-sm text-gray-200 mt-2">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-blue-400" />
                {Number(selectedHotel.latitude).toFixed(4)}°, {Number(selectedHotel.longitude).toFixed(4)}°
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-blue-400" />
                Listed: {new Date(selectedHotel.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Details & Overview Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Description & Amenities */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-blue-600" /> About This Property
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {selectedHotel.description}
              </p>
            </div>

            {/* Featured Amenities Grid */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
                Property Amenities & Services
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-gray-700">
                <div className="flex items-center p-2.5 bg-gray-50 rounded-lg">
                  <Wifi className="w-4 h-4 mr-2 text-blue-600" /> Free High-Speed WiFi
                </div>
                <div className="flex items-center p-2.5 bg-gray-50 rounded-lg">
                  <Coffee className="w-4 h-4 mr-2 text-blue-600" /> Gourmet Breakfast
                </div>
                <div className="flex items-center p-2.5 bg-gray-50 rounded-lg">
                  <ShieldCheck className="w-4 h-4 mr-2 text-emerald-600" /> 24/7 Security & Concierge
                </div>
                <div className="flex items-center p-2.5 bg-gray-50 rounded-lg">
                  <Star className="w-4 h-4 mr-2 text-amber-500" /> Infinity Rooftop Pool
                </div>
                <div className="flex items-center p-2.5 bg-gray-50 rounded-lg">
                  <MapPin className="w-4 h-4 mr-2 text-blue-600" /> Prime Central Location
                </div>
                <div className="flex items-center p-2.5 bg-gray-50 rounded-lg">
                  <Sparkles className="w-4 h-4 mr-2 text-purple-600" /> Luxury Spa & Wellness
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Pricing Card */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <span className="text-xs text-gray-500 uppercase tracking-wider block">Reservation Rate</span>
              <div className="text-3xl font-black text-gray-900 my-1">
                {formattedPrice}
                <span className="text-xs font-normal text-gray-500"> / night</span>
              </div>
              <span className="text-xs text-emerald-600 font-medium">Taxes and fees included</span>
            </div>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Check-in:</span>
                <span className="font-semibold text-gray-800">3:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Check-out:</span>
                <span className="font-semibold text-gray-800">11:00 AM</span>
              </div>
              <div className="flex justify-between">
                <span>Cancellation:</span>
                <span className="text-emerald-700 font-semibold">Free before 48h</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert(`Booking simulated for ${selectedHotel.title} at ${formattedPrice}/night.`)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition"
            >
              Reserve Accommodation
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Map & Geolocation Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" /> Location & Live Map
          </h2>
          <span className="text-xs text-gray-500">Interactive OpenStreetMap Powered by Leaflet</span>
        </div>

        <HotelMap
          hotelTitle={selectedHotel.title}
          latitude={selectedHotel.latitude}
          longitude={selectedHotel.longitude}
        />
      </section>
    </div>
  );
};

export default HotelDetailPage;
