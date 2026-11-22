import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hotelApi } from '../services/api';

// Async thunks
export const fetchHotels = createAsyncThunk(
  'hotels/fetchHotels',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { filters, pagination } = getState().hotels;
      const offset = (pagination.page - 1) * pagination.limit;
      const data = await hotelApi.getHotels({
        search: filters.search,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        limit: pagination.limit,
        offset
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch hotels');
    }
  }
);

export const fetchHotelById = createAsyncThunk(
  'hotels/fetchHotelById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await hotelApi.getHotelById(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch hotel details');
    }
  }
);

export const createHotel = createAsyncThunk(
  'hotels/createHotel',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const newHotel = await hotelApi.createHotel(formData);
      dispatch(fetchHotels());
      return newHotel;
    } catch (err) {
      const errors = err.response?.data?.errors;
      const msg = errors ? errors.join(', ') : (err.response?.data?.message || 'Failed to create hotel');
      return rejectWithValue(msg);
    }
  }
);

export const updateHotel = createAsyncThunk(
  'hotels/updateHotel',
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    try {
      const updated = await hotelApi.updateHotel(id, formData);
      dispatch(fetchHotels());
      return updated;
    } catch (err) {
      const errors = err.response?.data?.errors;
      const msg = errors ? errors.join(', ') : (err.response?.data?.message || 'Failed to update hotel');
      return rejectWithValue(msg);
    }
  }
);

export const deleteHotel = createAsyncThunk(
  'hotels/deleteHotel',
  async ({ id, deleteImage = true }, { dispatch, getState, rejectWithValue }) => {
    try {
      await hotelApi.deleteHotel(id, deleteImage);
      // Re-fetch list
      const { hotels, pagination } = getState().hotels;
      // If we deleted the only item on the current page (and not page 1), move back a page
      if (hotels.length === 1 && pagination.page > 1) {
        dispatch(setPage(pagination.page - 1));
      } else {
        dispatch(fetchHotels());
      }
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to delete hotel');
    }
  }
);

const initialState = {
  hotels: [],
  total: 0,
  selectedHotel: null,
  filters: {
    search: '',
    minPrice: '',
    maxPrice: ''
  },
  pagination: {
    page: 1,
    limit: 5
  },
  loading: false,
  detailLoading: false,
  actionLoading: false,
  error: null,
  successNotification: null // for delete or update feedback
};

const hotelSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.filters.search = action.payload;
      state.pagination.page = 1; // Reset to page 1 on search
    },
    setPriceFilter: (state, action) => {
      state.filters.minPrice = action.payload.minPrice;
      state.filters.maxPrice = action.payload.maxPrice;
      state.pagination.page = 1;
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        minPrice: '',
        maxPrice: ''
      };
      state.pagination.page = 1;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1;
    },
    clearSelectedHotel: (state) => {
      state.selectedHotel = null;
    },
    clearSuccessNotification: (state) => {
      state.successNotification = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch hotels
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single hotel
      .addCase(fetchHotelById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
        state.selectedHotel = null;
      })
      .addCase(fetchHotelById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedHotel = action.payload;
      })
      .addCase(fetchHotelById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })

      // Create hotel
      .addCase(createHotel.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createHotel.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.successNotification = `Hotel "${action.payload.title}" created successfully!`;
      })
      .addCase(createHotel.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Update hotel
      .addCase(updateHotel.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateHotel.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedHotel = action.payload;
        state.successNotification = `Hotel "${action.payload.title}" updated successfully!`;
      })
      .addCase(updateHotel.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Delete hotel
      .addCase(deleteHotel.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteHotel.fulfilled, (state) => {
        state.actionLoading = false;
        state.successNotification = 'Hotel deleted successfully!';
      })
      .addCase(deleteHotel.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setSearch,
  setPriceFilter,
  resetFilters,
  setPage,
  setLimit,
  clearSelectedHotel,
  clearSuccessNotification,
  clearError
} = hotelSlice.actions;

export default hotelSlice.reducer;
