import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearch, setPriceFilter, resetFilters, fetchHotels } from '../redux/hotelSlice';
import { Search, SlidersHorizontal, RotateCcw, DollarSign, X } from 'lucide-react';

const FilterSidebar = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.hotels);

  const [titleInput, setTitleInput] = useState(filters.search || '');
  const [minPrice, setMinPrice] = useState(filters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || '');
  const [sliderVal, setSliderVal] = useState(filters.maxPrice || 1000);

  // Sync state if redux filters reset
  useEffect(() => {
    setTitleInput(filters.search || '');
    setMinPrice(filters.minPrice || '');
    setMaxPrice(filters.maxPrice || '');
    setSliderVal(filters.maxPrice ? Number(filters.maxPrice) : 1000);
  }, [filters]);

  // Handle Search Input submit / debounce
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setTitleInput(val);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearch(titleInput));
    dispatch(fetchHotels());
  };

  const handleClearSearch = () => {
    setTitleInput('');
    dispatch(setSearch(''));
    dispatch(fetchHotels());
  };

  // Slider change updates max price
  const handleSliderChange = (e) => {
    const val = Number(e.target.value);
    setSliderVal(val);
    setMaxPrice(val);
  };

  // Apply Price Filters
  const handleApplyPrice = (e) => {
    e.preventDefault();
    dispatch(
      setPriceFilter({
        minPrice: minPrice !== '' ? Number(minPrice) : '',
        maxPrice: maxPrice !== '' ? Number(maxPrice) : ''
      })
    );
    dispatch(fetchHotels());
  };

  // Reset all filters
  const handleReset = () => {
    setTitleInput('');
    setMinPrice('');
    setMaxPrice('');
    setSliderVal(1000);
    dispatch(resetFilters());
    dispatch(fetchHotels());
  };

  const hasActiveFilters = filters.search || filters.minPrice !== '' || filters.maxPrice !== '';

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 space-y-5">
      {/* Active Search Filter Badge if searched from banner */}
      {filters.search && (
        <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl shadow-2xs flex items-center justify-between">
          <div className="text-xs">
            <span className="text-gray-500 block">Active Search:</span>
            <span className="font-bold text-blue-900">"{filters.search}"</span>
          </div>
          <button
            onClick={handleClearSearch}
            className="text-xs font-semibold text-red-600 hover:text-red-800 bg-white px-2.5 py-1 rounded-md border border-red-200 shadow-2xs transition"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Price Range Filter Card matching sample UI */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 flex items-center">
            <DollarSign className="w-4 h-4 mr-1.5 text-blue-600" /> Price Range
          </h3>
          <span className="text-xs font-medium text-gray-500">Per night</span>
        </div>

        <form onSubmit={handleApplyPrice} className="space-y-4">
          {/* Slider */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>Up to:</span>
              <span className="font-bold text-blue-600">${sliderVal}</span>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              step="25"
              value={sliderVal}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-gray-400 mt-1">
              <span>$50</span>
              <span>$500</span>
              <span>$1000+</span>
            </div>
          </div>

          {/* Min and Max Numeric Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Min Price</label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-xs text-gray-400">$</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full pl-6 pr-2 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Max Price</label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-xs text-gray-400">$</span>
                <input
                  type="number"
                  min="0"
                  placeholder="1000"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    if (e.target.value) setSliderVal(Number(e.target.value));
                  }}
                  className="w-full pl-6 pr-2 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col space-y-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition"
            >
              APPLY
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Helpful Filter Badges */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-xs text-blue-800">
        <p className="font-semibold mb-1">💡 Pro Tip:</p>
        <p className="text-blue-700 leading-relaxed">
          Use search combined with price bounds to quickly find budget, mid-range, or ultra-luxury resorts worldwide.
        </p>
      </div>
    </aside>
  );
};

export default FilterSidebar;
