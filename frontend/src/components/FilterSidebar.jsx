import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPriceFilter, resetFilters, fetchHotels } from '../redux/hotelSlice';
import { SlidersHorizontal, RotateCcw, DollarSign, X } from 'lucide-react';

const FilterSidebar = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.hotels);

  const [minPrice, setMinPrice] = useState(filters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || '');
  const [sliderVal, setSliderVal] = useState(filters.maxPrice || 1000);

  // Sync state if redux filters reset
  useEffect(() => {
    setMinPrice(filters.minPrice || '');
    setMaxPrice(filters.maxPrice || '');
    setSliderVal(filters.maxPrice ? Number(filters.maxPrice) : 1000);
  }, [filters]);

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
    setMinPrice('');
    setMaxPrice('');
    setSliderVal(1000);
    dispatch(resetFilters());
    dispatch(fetchHotels());
  };

  const hasActivePriceFilter = filters.minPrice !== '' || filters.maxPrice !== '';

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-4">
      {/* Active Search Filter Badge if searched from banner */}
      {filters.search && (
        <div className="bg-red-50 border border-red-200 p-3 rounded-lg shadow-2xs flex items-center justify-between text-xs">
          <div className="min-w-0 pr-2">
            <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider">Active Search</span>
            <span className="font-extrabold text-black truncate block">"{filters.search}"</span>
          </div>
          <button
            onClick={() => {
              dispatch(resetFilters());
              dispatch(fetchHotels());
            }}
            className="text-[11px] font-bold text-red-600 hover:text-white hover:bg-red-600 bg-white px-2 py-1 rounded border border-red-200 shadow-2xs transition flex-shrink-0"
          >
            Clear
          </button>
        </div>
      )}

      {/* Compact Price Range Filter Box (Red, White & Black Theme) */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-gray-200">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-black flex items-center">
            <DollarSign className="w-3.5 h-3.5 mr-1 text-red-600" /> Price Range
          </h3>
          <span className="text-[10px] font-bold uppercase text-gray-400">Nightly</span>
        </div>

        <form onSubmit={handleApplyPrice} className="space-y-3">
          {/* Compact Slider */}
          <div>
            <div className="flex justify-between items-center text-[11px] font-bold text-gray-500 mb-1">
              <span>$0</span>
              <span className="text-black font-extrabold bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                Up to ${sliderVal}
              </span>
              <span>$1000</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              step="25"
              value={sliderVal}
              onChange={handleSliderChange}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              aria-label="Price range slider"
            />
          </div>

          {/* Min & Max Inputs (Compact) */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="minPrice" className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">
                Min ($)
              </label>
              <input
                type="number"
                id="minPrice"
                min="0"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-md focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none transition font-medium"
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">
                Max ($)
              </label>
              <input
                type="number"
                id="maxPrice"
                min="0"
                placeholder="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-md focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none transition font-medium"
              />
            </div>
          </div>

          {/* Compact Action Buttons */}
          <div className="pt-1 flex space-x-2">
            <button
              type="submit"
              className="flex-1 py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-2xs transition transform active:scale-95"
            >
              Apply
            </button>
            {hasActivePriceFilter && (
              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                title="Reset Price Filter"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>
      </div>
    </aside>
  );
};

export default FilterSidebar;
