import { useDispatch, useSelector } from 'react-redux';
import {
  selectSelectedCategory,
  selectSortBy,
  setSelectedCategory,
  setSortBy,
} from '../store/slices/productsSlice';

const CATEGORIES = [
  'All',
  'Leafy Greens',
  'Root Veggies',
  'Daily Essentials',
  'Exotic',
];

export default function FilterBar() {
  const dispatch = useDispatch();
  const selectedCategory = useSelector(selectSelectedCategory);
  const sortBy = useSelector(selectSortBy);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => dispatch(setSelectedCategory(category))}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-700'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2 shrink-0">
        <label htmlFor="sort" className="text-sm text-slate-500 font-medium">
          Sort by:
        </label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value))}
          className="text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
    </div>
  );
}