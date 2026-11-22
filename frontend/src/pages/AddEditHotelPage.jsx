import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchHotelById, createHotel, updateHotel, clearSelectedHotel } from '../redux/hotelSlice';
import HotelForm from '../components/HotelForm';
import { ArrowLeft, Building2, AlertCircle } from 'lucide-react';

const AddEditHotelPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedHotel, detailLoading, actionLoading, error } = useSelector(
    (state) => state.hotels
  );

  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchHotelById(id));
    } else {
      dispatch(clearSelectedHotel());
    }
  }, [dispatch, id, isEdit]);

  const handleSubmit = async (formData) => {
    setFormError(null);
    try {
      if (isEdit) {
        await dispatch(updateHotel({ id, formData })).unwrap();
        navigate(`/hotels/${id}`);
      } else {
        const result = await dispatch(createHotel(formData)).unwrap();
        navigate('/');
      }
    } catch (err) {
      setFormError(err);
    }
  };

  const pageTitle = isEdit ? `Edit Hotel: ${selectedHotel?.title || ''}` : 'Add New Hotel Listing';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Dynamic SEO Meta Tags via React Helmet */}
      <Helmet>
        <title>{`${pageTitle} | Namlatech Hotels`}</title>
        <meta
          name="description"
          content={
            isEdit
              ? `Edit information, nightly rates, photos, and coordinates for ${selectedHotel?.title || 'hotel'}.`
              : 'Add a new luxury hotel or resort listing with photos, coordinates, and prices to the Namlatech Hotel Directory.'
          }
        />
      </Helmet>

      {/* Back Link */}
      <div>
        <Link
          to={isEdit ? `/hotels/${id}` : '/'}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isEdit ? 'Back to Hotel Details' : 'Back to Directory'}</span>
        </Link>
      </div>

      {/* Header card */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">{pageTitle}</h1>
            <p className="text-xs text-gray-500">
              {isEdit
                ? 'Update accommodation details, pricing, coordinates, and images.'
                : 'Complete the form below to list a new property on the global directory.'}
            </p>
          </div>
        </div>
      </div>

      {/* Global Error Banner */}
      {(error || formError) && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{formError || error}</span>
        </div>
      )}

      {/* Form or Loader */}
      {isEdit && detailLoading ? (
        <div className="p-12 text-center bg-white rounded-xl border border-gray-200">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-xs text-gray-500">Loading hotel data for editing...</p>
        </div>
      ) : (
        <HotelForm
          initialData={isEdit ? selectedHotel : null}
          onSubmit={handleSubmit}
          isSubmitting={actionLoading}
          isEdit={isEdit}
        />
      )}
    </div>
  );
};

export default AddEditHotelPage;
