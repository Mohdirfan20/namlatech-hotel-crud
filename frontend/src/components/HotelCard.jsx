import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Eye, Edit3, Trash2, Star, CheckCircle2 } from 'lucide-react';
import { getImageUrl } from '../services/api';

const HotelCard = ({ hotel, onDeleteClick }) => {
  const imageUrl = getImageUrl(hotel.image_path);

  // Format price
  const formattedPrice = Number(hotel.price).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col md:flex-row group">
      {/* Left: Thumbnail Image with Alt Tag */}
      <div className="md:w-64 lg:w-72 h-52 md:h-auto flex-shrink-0 relative overflow-hidden bg-gray-100">
        <Link to={`/hotels/${hotel.id}`} className="block w-full h-full">
          <img
            src={imageUrl}
            alt={`Exterior and luxury accommodation view of ${hotel.title}`}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </Link>
        <span className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
          Verified Hotel
        </span>
      </div>

      {/* Middle: Content details & snippet */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Rating stars & location */}
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <div className="flex items-center text-amber-500 text-xs font-semibold">
              <Star className="w-4 h-4 fill-amber-400 stroke-amber-500 mr-1" />
              <span>4.8</span>
              <span className="text-gray-400 ml-1 font-normal">(120+ verified reviews)</span>
            </div>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5 mr-1 text-blue-600 flex-shrink-0" />
              <span>
                {Number(hotel.latitude).toFixed(3)}°, {Number(hotel.longitude).toFixed(3)}°
              </span>
            </div>
          </div>

          {/* Title - clickable to detail page */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition">
            <Link to={`/hotels/${hotel.id}`}>
              {hotel.title}
            </Link>
          </h3>

          {/* Truncated 2-3 line description snippet */}
          <p className="text-sm text-gray-600 line-clamp-2 md:line-clamp-3 leading-relaxed mb-3">
            {hotel.description}
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-700">
            <span className="inline-flex items-center bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> Free Cancellation
            </span>
            <span className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
              Free High-Speed Wi-Fi
            </span>
          </div>
        </div>

        {/* Small timestamp */}
        <div className="mt-3 text-[11px] text-gray-400">
          Listed on: {new Date(hotel.created_at).toLocaleDateString()}
        </div>
      </div>

      {/* Right: Price & Action Buttons */}
      <div className="md:w-56 p-5 bg-gray-50/70 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-between items-center md:items-end text-center md:text-right">
        <div className="w-full">
          <span className="text-xs text-gray-500 uppercase tracking-wider block">Starting From</span>
          <div className="text-2xl font-black text-gray-900 my-1">
            {formattedPrice}
            <span className="text-xs font-normal text-gray-500"> / night</span>
          </div>
          <span className="text-xs font-medium text-emerald-600 block mb-4">
            Best Price Guaranteed
          </span>
        </div>

        {/* Action Buttons: View Details, Edit, Delete */}
        <div className="w-full space-y-2">
          {/* View Details */}
          <Link
            to={`/hotels/${hotel.id}`}
            className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center space-x-1.5 transition active:scale-95"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </Link>

          {/* Edit & Delete row */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/edit/${hotel.id}`}
              className="py-1.5 px-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-xs font-medium rounded-lg flex items-center justify-center space-x-1 transition"
              title="Edit Hotel"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              <span>Edit</span>
            </Link>

            <button
              type="button"
              onClick={() => onDeleteClick(hotel)}
              className="py-1.5 px-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 text-xs font-medium rounded-lg flex items-center justify-center space-x-1 transition"
              title="Delete Hotel"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default HotelCard;
