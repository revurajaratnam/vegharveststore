import { Minus, Plus, ShoppingBag, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToCart,
  decrementQuantity,
  selectItemQuantityById,
} from '../store/slices/cartSlice';

export default function ProductCard({ product, onSelect }) {
  const dispatch = useDispatch();
  const quantity = useSelector(selectItemQuantityById(product.id));

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => onSelect(product.id)}
        className="block w-full cursor-pointer text-left"
        aria-label={`View ${product.name}`}
      >
        <div className="relative aspect-[4/3] bg-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
          {product.originalPrice && (
            <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-slate-900">
              Sale
            </span>
          )}
        </div>
      </button>

      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            {product.category}
          </p>
          {product.rating && (
            <span className="flex items-center gap-1 text-xs font-semibold text-slate-600">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {product.rating}
            </span>
          )}
        </div>
        <h3 className="mt-1 text-base font-bold text-slate-900">{product.name}</h3>
        <p className="mt-1 text-sm text-slate-500">{product.unit}</p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <span className="text-lg font-bold text-slate-900">
              ${Number(product.price).toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="ml-2 text-sm text-slate-400 line-through">
                ${Number(product.originalPrice).toFixed(2)}
              </span>
            )}
          </div>

          {quantity > 0 ? (
            <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 p-1">
              <button
                type="button"
                onClick={() => dispatch(decrementQuantity(product.id))}
                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100"
                aria-label={`Remove one ${product.name}`}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-5 text-center text-sm font-bold">{quantity}</span>
              <button
                type="button"
                onClick={() => dispatch(addToCart(product))}
                className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                aria-label={`Add another ${product.name}`}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => dispatch(addToCart(product))}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              <ShoppingBag className="h-4 w-4" />
              Add
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
