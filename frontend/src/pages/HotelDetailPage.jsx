import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchHotelById, deleteHotel, clearSuccessNotification } from '../redux/hotelSlice';
import { getImageUrl } from '../services/api';
import HotelMap from '../components/HotelMap';
import { DeleteConfirmModal, SuccessPopup } from '../components/SuccessModal';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  MapPin,
  DollarSign,
  Star,
  Calendar,
  ShieldCheck,
  Wifi,
  Coffee,
  Sparkles,
  Camera,
  Bed,
  Bath,
  UtensilsCrossed,
  Waves,
  Eye,
  CheckCircle2
} from 'lucide-react';

const HotelDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedHotel, detailLoading, error, successNotification } = useSelector(
    (state) => state.hotels
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchHotelById(id));
      setActivePhotoIndex(0);
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
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="inline-block w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Loading luxury property details...</p>
      </div>
    );
  }

  if (error || !selectedHotel) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
          <h2 className="text-xl font-black text-red-700 mb-2">Hotel Listing Not Found</h2>
          <p className="text-xs text-red-600 mb-6 font-medium">
            {error || "The hotel you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-red-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  const primaryImageUrl = getImageUrl(selectedHotel.image_path);

  // Curated Luxury Interior & Room Photos
  const galleryPhotos = [
    {
      title: 'Grand Exterior & Architecture',
      tag: 'Property Exterior',
      url: primaryImageUrl,
      icon: Camera
    },
    {
      title: 'Executive Master Suite & King Bedroom',
      tag: 'Bedroom Suite',
      url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      icon: Bed
    },
    {
      title: 'Italian Marble Spa Bathroom & Soaking Tub',
      tag: 'Spa & Bath',
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
      icon: Bath
    },
    {
      title: 'Fine Dining Pavilion & Skyline Cocktail Lounge',
      tag: 'Gourmet Dining',
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      icon: UtensilsCrossed
    },
    {
      title: 'Infinity Edge Panoramic Pool & Cabana Deck',
      tag: 'Wellness & Pool',
      url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
      icon: Waves
    }
  ];

  const currentActivePhoto = galleryPhotos[activePhotoIndex] || galleryPhotos[0];

  const formattedPrice = Number(selectedHotel.price).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dynamic SEO via React Helmet */}
      <Helmet>
        <title>{`${selectedHotel.title} | Luxury Stays & Suites | Namlatech`}</title>
        <meta
          name="description"
          content={`Explore ${selectedHotel.title}. Rates from ${formattedPrice}/night with verified reviews, suites gallery, and interactive maps.`}
        />
      </Helmet>

      {successNotification && (
        <SuccessPopup
          message={successNotification}
          onClose={() => dispatch(clearSuccessNotification())}
        />
      )}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        hotel={selectedHotel}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isDeleting={isDeleting}
      />

      {/* Top Navigation Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs font-bold text-gray-700 hover:text-red-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to All Hotels</span>
        </Link>

        <div className="flex items-center space-x-2">
          <Link
            to={`/edit/${selectedHotel.id}`}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-900 text-xs font-bold rounded-lg shadow-2xs transition"
            title="Edit Hotel Listing"
          >
            <Edit3 className="w-3.5 h-3.5 text-red-600" />
            <span>Edit Property</span>
          </Link>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold rounded-lg shadow-2xs transition"
            title="Delete Hotel Listing"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Showcase Hero Image Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
        {/* Active Hero Image */}
        <div className="relative h-72 sm:h-96 md:h-[440px] w-full bg-black overflow-hidden group">
          <img
            src={currentActivePhoto.url}
            alt={currentActivePhoto.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>

          {/* Hero Badges */}
          <div className="absolute top-5 left-5 flex items-center space-x-2">
            <span className="bg-red-600 text-white px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider shadow-sm">
              Verified Premier Luxury
            </span>
            <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-md border border-white/20">
              {currentActivePhoto.tag}
            </span>
          </div>

          {/* Hero Text Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center text-amber-400 text-xs font-bold bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded">
                <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" /> 4.9 Superb (180+ Reviews)
              </div>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight drop-shadow-md text-white">
              {selectedHotel.title}
            </h1>
            <div className="flex items-center space-x-3 text-xs sm:text-sm text-gray-300 mt-2 font-medium">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-red-500" />
                {Number(selectedHotel.latitude).toFixed(4)}°, {Number(selectedHotel.longitude).toFixed(4)}°
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-red-500" />
                Updated: {new Date(selectedHotel.updated_at || selectedHotel.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Interior & Room Photo Gallery Selector (User Feature) */}
        <div className="bg-zinc-950 p-4 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-3 text-white">
            <div className="flex items-center space-x-2">
              <Camera className="w-4 h-4 text-red-500" />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Interior, Room & Suite Photo Gallery ({galleryPhotos.length})
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 font-medium hidden sm:inline">
              Click photo to preview in high-resolution
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {galleryPhotos.map((photo, index) => {
              const isSelected = index === activePhotoIndex;
              const IconComp = photo.icon;
              return (
                <button
                  key={photo.tag + index}
                  type="button"
                  onClick={() => setActivePhotoIndex(index)}
                  className={`group relative h-24 rounded-xl overflow-hidden border-2 text-left transition transform active:scale-95 ${
                    isSelected ? 'border-red-600 shadow-md ring-2 ring-red-500/50' : 'border-zinc-800 opacity-60 hover:opacity-100 hover:border-zinc-600'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-white text-[10px] font-bold">
                    <span className="truncate flex items-center">
                      <IconComp className="w-3 h-3 mr-1 text-red-400 flex-shrink-0" />
                      {photo.tag}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0"></span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Details & Overview Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Description & Amenities */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-lg font-black text-black mb-3 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-red-600" /> About This Property
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-medium">
                {selectedHotel.description}
              </p>
            </div>

            {/* Room Specifications & Brand Highlights */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-xs font-black text-black mb-3 uppercase tracking-wider">
                Suite Specifications & Luxury Comforts
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-zinc-50 border border-gray-200 rounded-xl">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Bedding</span>
                  <span className="font-extrabold text-black">King Plush Bed</span>
                </div>
                <div className="p-3 bg-zinc-50 border border-gray-200 rounded-xl">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Room Size</span>
                  <span className="font-extrabold text-black">68 m² / 730 sq ft</span>
                </div>
                <div className="p-3 bg-zinc-50 border border-gray-200 rounded-xl">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">View</span>
                  <span className="font-extrabold text-black">Ocean & Skyline</span>
                </div>
                <div className="p-3 bg-zinc-50 border border-gray-200 rounded-xl">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Occupancy</span>
                  <span className="font-extrabold text-black">Up to 3 Guests</span>
                </div>
              </div>
            </div>

            {/* Featured Amenities Grid */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-xs font-black text-black mb-4 uppercase tracking-wider">
                Included Amenities & World-Class Services
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-gray-800">
                <div className="flex items-center p-3 bg-zinc-50 border border-gray-200 rounded-xl font-medium">
                  <Wifi className="w-4 h-4 mr-2.5 text-red-600 flex-shrink-0" /> Free High-Speed WiFi
                </div>
                <div className="flex items-center p-3 bg-zinc-50 border border-gray-200 rounded-xl font-medium">
                  <Coffee className="w-4 h-4 mr-2.5 text-red-600 flex-shrink-0" /> Gourmet Breakfast
                </div>
                <div className="flex items-center p-3 bg-zinc-50 border border-gray-200 rounded-xl font-medium">
                  <ShieldCheck className="w-4 h-4 mr-2.5 text-red-600 flex-shrink-0" /> 24/7 Security & Butler
                </div>
                <div className="flex items-center p-3 bg-zinc-50 border border-gray-200 rounded-xl font-medium">
                  <Star className="w-4 h-4 mr-2.5 text-amber-500 flex-shrink-0" /> Rooftop Infinity Pool
                </div>
                <div className="flex items-center p-3 bg-zinc-50 border border-gray-200 rounded-xl font-medium">
                  <MapPin className="w-4 h-4 mr-2.5 text-red-600 flex-shrink-0" /> Prime Location Access
                </div>
                <div className="flex items-center p-3 bg-zinc-50 border border-gray-200 rounded-xl font-medium">
                  <Sparkles className="w-4 h-4 mr-2.5 text-red-600 flex-shrink-0" /> Ayurvedic Luxury Spa
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Reservation Booking Card (Red, White & Black) */}
          <div className="bg-zinc-900 text-white p-6 rounded-2xl border border-zinc-800 h-fit space-y-5 shadow-lg">
            <div className="border-b border-zinc-800 pb-4">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Standard Nightly Rate</span>
              <div className="text-3xl font-black text-white my-1">
                {formattedPrice}
                <span className="text-xs font-normal text-zinc-400"> / night</span>
              </div>
              <span className="text-xs text-red-400 font-bold flex items-center mt-1">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-red-500" /> Best Price Guaranteed • Free Cancellation
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="flex justify-between">
                <span>Check-in:</span>
                <span className="font-bold text-white">3:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Check-out:</span>
                <span className="font-bold text-white">11:00 AM</span>
              </div>
              <div className="flex justify-between">
                <span>Cancellation:</span>
                <span className="text-red-400 font-bold">Free before 48 hours</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert(`Booking simulated for ${selectedHotel.title} at ${formattedPrice}/night.`)}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition transform active:scale-95"
            >
              Reserve Accommodation
            </button>
            <p className="text-[10px] text-zinc-500 text-center font-medium">Instant confirmation • No booking fees</p>
          </div>
        </div>
      </div>

      {/* Interactive Map & Geolocation Distance Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <h2 className="text-lg font-black text-black flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-red-600" /> Property Coordinates & Live Distance
          </h2>
          <span className="text-xs font-bold text-gray-500">
            {Number(selectedHotel.latitude).toFixed(4)}° N, {Number(selectedHotel.longitude).toFixed(4)}° E
          </span>
        </div>

        {/* Leaflet Map with Geolocation */}
        <HotelMap
          latitude={selectedHotel.latitude}
          longitude={selectedHotel.longitude}
          hotelTitle={selectedHotel.title}
        />
      </section>
    </div>
  );
};

export default HotelDetailPage;
