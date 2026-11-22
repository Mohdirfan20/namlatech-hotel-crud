import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

export const hotelApi = {
  // GET /api/hotels with filters and pagination
  getHotels: async ({ search = '', minPrice = '', maxPrice = '', limit = 5, offset = 0 } = {}) => {
    const params = new URLSearchParams();
    if (search.trim()) params.append('search', search.trim());
    if (minPrice !== '' && !isNaN(minPrice)) params.append('minPrice', minPrice);
    if (maxPrice !== '' && !isNaN(maxPrice)) params.append('maxPrice', maxPrice);
    params.append('limit', limit);
    params.append('offset', offset);

    const response = await api.get(`/hotels?${params.toString()}`);
    return response.data;
  },

  // GET /api/hotels/:id
  getHotelById: async (id) => {
    const response = await api.get(`/hotels/${id}`);
    return response.data;
  },

  // POST /api/hotels (multipart/form-data)
  createHotel: async (formData) => {
    const response = await api.post('/hotels', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // PUT /api/hotels/:id (multipart/form-data)
  updateHotel: async (id, formData) => {
    const response = await api.put(`/hotels/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // DELETE /api/hotels/:id?deleteImage=true
  deleteHotel: async (id, deleteImage = true) => {
    const response = await api.delete(`/hotels/${id}?deleteImage=${deleteImage}`);
    return response.data;
  }
};

/**
 * Returns full URL for an image path
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
};

export default api;
