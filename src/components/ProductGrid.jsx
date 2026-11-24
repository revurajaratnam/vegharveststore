import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectSearchQuery,
  selectSelectedCategory,
  selectSortBy,
  resetFilters,
} from '../store/slices/productsSlice';
import { useGetProductsQuery } from '../store/api/ecommerceApi';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';

export default function ProductGrid() {
  const dispatch = useDispatch();
  const search = useSelector(selectSearchQuery);
  const category = useSelector(selectSelectedCategory);
  const sortBy = useSelector(selectSortBy);

  const [selectedProductId, setSelectedProductId] = useState(null);

  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery({ category, search });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-80 rounded-2xl bg-slate-200 animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-14 bg-white rounded-2xl border border-rose-200">
        <p className="text-rose-600 font-medium">Could not load vegetables from the server.</p>
        <button
          onClick={refetch}
          className="mt-4 px-5 py-2 rounded-full bg-emerald-600 text-white text-sm font-semibold cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  if (sortedProducts.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-600 font-medium">No vegetables found.</p>
        <button
          onClick={() => dispatch(resetFilters())}
          className="mt-4 px-5 py-2 rounded-full bg-emerald-600 text-white text-sm font-semibold cursor-pointer"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={setSelectedProductId}
          />
        ))}
      </div>

      <ProductDetailModal
        productId={selectedProductId}
        onClose={() => setSelectedProductId(null)}
      />
    </>
  );
}