import { Minus, Plus, ShoppingBag, Star, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToCart,
  decrementQuantity,
  selectItemQuantityById,
} from '../store/slices/cartSlice';
import { useGetProductByIdQuery } from '../store/api/ecommerceApi';

export default function ProductDetailModal({ productId, onClose }) {
  const dispatch = useDispatch();
  const { data: product, isLoading, isError } = useGetProductByIdQuery(
    productId,
    { skip: !productId }
  );
  const quantity = useSelector(selectItemQuantityById(productId));

  if (!productId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 text-slate-500 shadow-sm hover:text-slate-800"
          aria-label="Close product details"
        >
          <X className="h-5 w-5" />
        </button>

        {isLoading ? (
          <div className="h-80 animate-pulse bg-slate-200" />
        ) : isError || !product ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Could not load product details.
          </div>
        ) : (
          <div className="grid md:grid-cols-2">
            <img
              src={product.image}
              alt={product.name}
              className="h-72 w-full object-cover md:h-full"
            />
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                {product.category}
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">{product.name}</h2>
              {product.rating && (
                <p className="mt-2 flex items-center gap-1 text-sm font-semibold text-slate-600">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {product.rating}
                </p>
              )}
              <p className="mt-4 text-sm text-slate-500">{product.description || product.unit}</p>
              <p className="mt-6 text-2xl font-bold text-slate-900">
                ${Number(product.price).toFixed(2)}
              </p>

              {quantity > 0 ? (
                <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-emerald-200 p-1.5">
                  <button
                    type="button"
                    onClick={() => dispatch(decrementQuantity(product.id))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100"
                    aria-label={`Remove one ${product.name}`}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-6 text-center font-bold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => dispatch(addToCart(product))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white"
                    aria-label={`Add another ${product.name}`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => dispatch(addToCart(product))}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to Basket
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
