import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Image as ImageIcon, MapPin, DollarSign, X, AlertCircle, CheckCircle, Navigation } from 'lucide-react';
import { getImageUrl } from '../services/api';

const HotelForm = ({ initialData = null, onSubmit, isSubmitting = false, isEdit = false }) => {
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [price, setPrice] = useState('');
  
  // File upload and preview
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [existingImagePath, setExistingImagePath] = useState('');

  // Validation errors
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Populate data when editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setLatitude(initialData.latitude !== undefined ? String(initialData.latitude) : '');
      setLongitude(initialData.longitude !== undefined ? String(initialData.longitude) : '');
      setPrice(initialData.price !== undefined ? String(initialData.price) : '');
      if (initialData.image_path) {
        setExistingImagePath(initialData.image_path);
        setPreviewUrl(getImageUrl(initialData.image_path));
      }
    }
  }, [initialData]);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Validate form fields
  const validate = () => {
    const errs = {};

    // Title validation
    if (!title.trim()) {
      errs.title = 'Hotel title is required';
    } else if (title.trim().length < 2) {
      errs.title = 'Title must be at least 2 characters long';
    } else if (title.trim().length > 255) {
      errs.title = 'Title cannot exceed 255 characters';
    }

    // Description validation
    if (!description.trim()) {
      errs.description = 'Hotel description is required';
    } else if (description.trim().length < 10) {
      errs.description = 'Description must be at least 10 characters long';
    }

    // Latitude validation
    if (latitude === '' || latitude === null || latitude === undefined) {
      errs.latitude = 'Latitude coordinate is required';
    } else {
      const latNum = parseFloat(latitude);
      if (isNaN(latNum) || latNum < -90 || latNum > 90) {
        errs.latitude = 'Latitude must be a valid number between -90 and 90';
      }
    }

    // Longitude validation
    if (longitude === '' || longitude === null || longitude === undefined) {
      errs.longitude = 'Longitude coordinate is required';
    } else {
      const lngNum = parseFloat(longitude);
      if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
        errs.longitude = 'Longitude must be a valid number between -180 and 180';
      }
    }

    // Price validation
    if (price === '' || price === null || price === undefined) {
      errs.price = 'Price is required';
    } else {
      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        errs.price = 'Price must be a positive number greater than 0';
      }
    }

    // Image validation
    if (!isEdit && !imageFile) {
      errs.image = 'Hotel image upload is required for new listings';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle file select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: 'Invalid image format. Allowed: JPEG, PNG, WEBP, GIF' }));
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: 'Image size exceeds 5MB limit' }));
      return;
    }

    // Clear previous error
    setErrors((prev) => {
      const newErrs = { ...prev };
      delete newErrs.image;
      return newErrs;
    });

    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // Quick fill coordinates from device location
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
        setErrors((prev) => {
          const newErrs = { ...prev };
          delete newErrs.latitude;
          delete newErrs.longitude;
          return newErrs;
        });
      },
      (err) => {
        alert('Could not access location: ' + err.message);
      }
    );
  };

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      title: true,
      description: true,
      latitude: true,
      longitude: true,
      price: true,
      image: true
    });

    if (!validate()) return;

    // Build FormData
    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('price', price);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Image Upload Section with Live Preview */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Hotel Image <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-4">
          Upload a high-quality photo of the hotel facade, room, or resort grounds (PNG, JPG, WEBP, up to 5MB).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Upload Dropzone */}
          <div className="relative border-2 border-dashed border-gray-300 hover:border-red-500 rounded-xl p-6 text-center cursor-pointer transition bg-gray-50 hover:bg-red-50/30 group">
            <input
              type="file"
              id="hotel-image-input"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:scale-110 transition">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="text-sm font-semibold text-gray-700">
                {imageFile ? imageFile.name : 'Click to browse or drag file here'}
              </div>
              <p className="text-xs text-gray-400">Supported: JPG, PNG, WEBP (Max: 5MB)</p>
            </div>
          </div>

          {/* Live Preview Display */}
          <div className="flex flex-col items-center justify-center">
            {previewUrl ? (
              <div className="relative w-full h-44 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
                <img
                  src={previewUrl}
                  alt="Live preview of hotel upload"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[11px] px-2 py-0.5 rounded">
                  {imageFile ? 'New Image Selected' : 'Current Hotel Image'}
                </span>
                {imageFile && (
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setPreviewUrl(existingImagePath ? getImageUrl(existingImagePath) : '');
                    }}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow transition"
                    title="Remove selected image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="w-full h-44 rounded-lg border border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-gray-400">
                <ImageIcon className="w-8 h-8 mb-2" />
                <span className="text-xs">No image preview available</span>
              </div>
            )}
          </div>
        </div>

        {errors.image && (
          <p className="text-xs text-red-600 mt-2 flex items-center">
            <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.image}
          </p>
        )}
      </div>

      {/* 2. Hotel Title & Price Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
          Basic Hotel Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Hotel Title / Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (touched.title) validate();
              }}
              onBlur={() => setTouched((p) => ({ ...p, title: true }))}
              placeholder="e.g. Grand Luxury Resort & Spa"
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg border ${
                errors.title ? 'border-red-500 bg-red-50/20' : 'border-gray-300 bg-gray-50'
              } focus:bg-white focus:ring-2 focus:ring-red-600 outline-none transition`}
            />
            {errors.title && (
              <p className="text-xs text-red-600 mt-1 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.title}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Nightly Price (USD) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400 font-semibold">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (touched.price) validate();
                }}
                onBlur={() => setTouched((p) => ({ ...p, price: true }))}
                placeholder="250.00"
                className={`w-full pl-8 pr-3.5 py-2.5 text-sm rounded-lg border ${
                  errors.price ? 'border-red-500 bg-red-50/20' : 'border-gray-300 bg-gray-50'
                } focus:bg-white focus:ring-2 focus:ring-red-600 outline-none transition`}
              />
            </div>
            {errors.price && (
              <p className="text-xs text-red-600 mt-1 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.price}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (touched.description) validate();
            }}
            onBlur={() => setTouched((p) => ({ ...p, description: true }))}
            placeholder="Describe the hotel atmosphere, amenities, views, dining options, and guest experience..."
            className={`w-full px-3.5 py-2.5 text-sm rounded-lg border ${
              errors.description ? 'border-red-500 bg-red-50/20' : 'border-gray-300 bg-gray-50'
            } focus:bg-white focus:ring-2 focus:ring-red-600 outline-none transition`}
          ></textarea>
          {errors.description && (
            <p className="text-xs text-red-600 mt-1 flex items-center">
              <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.description}
            </p>
          )}
        </div>
      </div>

      {/* 3. Geographic Coordinates Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h3 className="text-sm font-bold text-gray-900 flex items-center">
            <MapPin className="w-4 h-4 mr-1.5 text-red-600" /> Geographic Location
          </h3>
          <button
            type="button"
            onClick={handleUseMyLocation}
            className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center space-x-1"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Fill Current Device Coordinates</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Latitude */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Latitude (-90 to 90) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => {
                setLatitude(e.target.value);
                if (touched.latitude) validate();
              }}
              onBlur={() => setTouched((p) => ({ ...p, latitude: true }))}
              placeholder="e.g. 48.8584"
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg border ${
                errors.latitude ? 'border-red-500 bg-red-50/20' : 'border-gray-300 bg-gray-50'
              } focus:bg-white focus:ring-2 focus:ring-red-600 outline-none transition`}
            />
            {errors.latitude && (
              <p className="text-xs text-red-600 mt-1 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.latitude}
              </p>
            )}
          </div>

          {/* Longitude */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Longitude (-180 to 180) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => {
                setLongitude(e.target.value);
                if (touched.longitude) validate();
              }}
              onBlur={() => setTouched((p) => ({ ...p, longitude: true }))}
              placeholder="e.g. 2.2945"
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg border ${
                errors.longitude ? 'border-red-500 bg-red-50/20' : 'border-gray-300 bg-gray-50'
              } focus:bg-white focus:ring-2 focus:ring-red-600 outline-none transition`}
            />
            {errors.longitude && (
              <p className="text-xs text-red-600 mt-1 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.longitude}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={() => navigate('/')}
          disabled={isSubmitting}
          className="px-5 py-2.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg shadow-sm flex items-center space-x-2 transition disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Saving Hotel...</span>
            </>
          ) : (
            <span>{isEdit ? 'Update Hotel' : 'Create Hotel Listing'}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default HotelForm;
