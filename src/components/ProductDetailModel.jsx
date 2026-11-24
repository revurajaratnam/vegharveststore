import { useDispatch, useSelector } from 'react-redux';
import { X, Star, ShoppingCart, Plus, Minus, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { useGetProductByIdQuery } from '../store/api/ecommerceApi';
import {
  addToCart,
  decrementQuantity,
  selectItemQuantityById,
} from '../store/slices/cartSlice';

export default function ProductDetailModal({ productId, onClose }) {
  const dispatch = useDispatch();
  const { data: product, isLoading, isError } = useGetProductByIdQuery(productId, {
    skip: !productId,
  });
  const quantity = useSelector(selectItemQuantityById(productId));

  if (!productId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 text-slate-500 hover:text-slate-900 shadow-sm cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading product details...</div>
        ) : isError || !product ? (
          <div className="p-12 text-center text-rose-600">Failed to load product details.</div>
        ) : (
          <div className="overflow-y-auto flex-1">
            {/* Top Product Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 border-b border-slate-100">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.organic && (
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-semibold">
                    Organic
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <span className="text-xs font-medium text-emerald-700 uppercase tracking-wider">
                  {product.category}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">{product.name}</h2>
                <p className="text-sm text-slate-500">{product.unit}</p>

                {/* Rating Summary */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-800">{product.rating}</span>
                  <span className="text-xs text-slate-500">
                    ({product.numReviews || product.reviews?.length || 0} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      ${Number(product.originalPrice).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Add to Cart / Stepper */}
                <div className="mt-auto pt-5">
                  {!product.inStock ? (
                    <span className="inline-block px-4 py-2 rounded-xl bg-slate-100 text-slate-500 text-sm font-semibold">
                      Out of Stock
                    </span>
                  ) : quantity === 0 ? (
                    <button
                      onClick={() => dispatch(addToCart(product))}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Basket
                    </button>
                  ) : (
                    <div className="inline-flex items-center gap-4 bg-emerald-600 text-white rounded-xl px-2 py-1.5">
                      <button
                        onClick={() => dispatch(decrementQuantity(product.id))}
                        className="w-8 h-8 rounded-lg hover:bg-emerald-700 flex items-center justify-center cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-bold w-6 text-center">{quantity}</span>
                      <button
                        onClick={() => dispatch(addToCart(product))}
                        className="w-8 h-8 rounded-lg hover:bg-emerald-700 flex items-center justify-center cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Reviews & Photos Section */}
            <div className="p-6 bg-slate-50/60">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                Customer Reviews ({product.reviews?.length || 0})
              </h3>

              {!product.reviews || product.reviews.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-xl border border-slate-200 text-sm text-slate-500">
                  No reviews yet. Order this vegetable to be the first to review it!
                </div>
              ) : (
                <div className="space-y-4">
                  {product.reviews.map((review) => (
                    <div
                      key={review._id || review.createdAt}
                      className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{review.name}</p>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= review.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-slate-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-sm text-slate-700 leading-relaxed">{review.comment}</p>

                      {/* Uploaded Review Photos */}
                      {review.photos && review.photos.length > 0 && (
                        <div className="pt-1">
                          <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1.5">
                            <ImageIcon className="w-3 h-3" /> Customer Photos
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {review.photos.map((photoUrl, idx) => (
                              <a
                                key={idx}
                                href={photoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="block w-18 h-18 rounded-lg overflow-hidden border border-slate-200 hover:ring-2 hover:ring-emerald-500 transition"
                              >
                                <img
                                  src={photoUrl}
                                  alt={`Review photo ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}