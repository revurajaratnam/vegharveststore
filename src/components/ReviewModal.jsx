import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { CheckCircle2, Star, X } from 'lucide-react';
import { useAddProductReviewMutation } from '../store/api/ecommerceApi';
import { addToast } from '../store/slices/toastSlice';

export default function ReviewModal({ product, onClose }) {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState([]);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [addReview, { isLoading }] = useAddProductReviewMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    const formData = new FormData();
    formData.append('rating', String(rating));
    formData.append('comment', comment);
    photos.slice(0, 3).forEach((photo) => formData.append('photos', photo));

    try {
      await addReview({
        productId: product.productId || product.id,
        formData,
      }).unwrap();

      setSuccess(true);
      dispatch(addToast('Review submitted successfully!', 'success'));
      setTimeout(onClose, 900);
    } catch (error) {
      const msg = error?.data?.message || 'Failed to submit your review.';
      setErrorMessage(msg);
      dispatch(addToast(msg, 'error'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 cursor-pointer text-slate-400 hover:text-slate-700"
          aria-label="Close review"
        >
          <X className="h-5 w-5" />
        </button>

        {success ? (
          <div className="py-10 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
            <p className="mt-3 font-bold text-slate-900">Review submitted</p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-bold text-slate-900">
              Review {product.name}
            </h2>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-600">
                  Rating
                </p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      type="button"
                      key={value}
                      onClick={() => setRating(value)}
                      className="cursor-pointer"
                      aria-label={`${value} stars`}
                    >
                      <Star
                        className={`h-6 w-6 ${
                          value <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <label className="block text-xs font-semibold text-slate-600">
                Comment
                <textarea
                  required
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  className="mt-1 min-h-24 w-full resize-y rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
                  placeholder="Share your experience..."
                />
              </label>

              <label className="block text-xs font-semibold text-slate-600">
                Photos (up to 3)
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) =>
                    setPhotos(Array.from(event.target.files || []).slice(0, 3))
                  }
                  className="mt-1 block w-full text-xs text-slate-500"
                />
              </label>

              {errorMessage && (
                <p className="rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {isLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}