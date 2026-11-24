import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  CheckCircle2,
  Loader2,
  MapPin,
  Phone,
  ArrowLeft,
} from 'lucide-react';
import {
  selectCartItems,
  selectCartIsOpen,
  selectCartSubtotal,
  addToCart,
  decrementQuantity,
  removeFromCart,
  clearCart,
  closeCart,
} from '../store/slices/cartSlice';
import { selectCurrentUser } from '../store/slices/authSlice';
import { addToast } from '../store/slices/toastSlice';
import { useCreateOrderMutation } from '../store/api/ecommerceApi';

const FREE_DELIVERY_THRESHOLD = 25;
const DELIVERY_FEE = 3.99;

const INITIAL_SHIPPING = {
  phone: '',
  street: '',
  city: '',
  postalCode: '',
};

export default function CartDrawer({ onRequireAuth }) {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isOpen = useSelector(selectCartIsOpen);
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const [step, setStep] = useState('cart'); // 'cart' | 'shipping'
  const [orderConfirmation, setOrderConfirmation] = useState(null);
  const [shipping, setShipping] = useState(INITIAL_SHIPPING);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const deliveryCost =
    subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryCost;

  const handleClose = () => {
    setStep('cart');
    setValidationError('');
    dispatch(closeCart());
  };

  // Step 1 -> Step 2 (or Sign In if guest)
  const handleProceedToShipping = () => {
    if (!user) {
      handleClose();
      onRequireAuth?.();
      return;
    }
    setValidationError('');
    setStep('shipping');
  };

  // Step 2 -> Submit Order to MongoDB
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (
      !shipping.phone.trim() ||
      !shipping.street.trim() ||
      !shipping.city.trim() ||
      !shipping.postalCode.trim()
    ) {
      setValidationError('Please enter your phone number and full delivery address.');
      return;
    }

    const orderPayload = {
      items: items.map((item) => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
      shippingDetails: {
        phone: shipping.phone.trim(),
        street: shipping.street.trim(),
        city: shipping.city.trim(),
        postalCode: shipping.postalCode.trim(),
      },
      subtotal: Number(subtotal.toFixed(2)),
      deliveryFee: deliveryCost,
      totalAmount: Number(total.toFixed(2)),
      paymentMethod,
    };

    try {
      const response = await createOrder(orderPayload).unwrap();
      setOrderConfirmation(response?.orderId || 'CONFIRMED');
      dispatch(clearCart());
      dispatch(addToast(`Order ${response?.orderId || ''} placed!`, 'success'));
      setShipping(INITIAL_SHIPPING);

      setTimeout(() => {
        setOrderConfirmation(null);
        setStep('cart');
        dispatch(closeCart());
      }, 2500);
    } catch (checkoutError) {
      const msg = checkoutError?.data?.message || 'Failed to place order.';
      dispatch(addToast(msg, 'error'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        onClick={handleClose}
      />

      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            {step === 'shipping' && !orderConfirmation && (
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="cursor-pointer rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                aria-label="Back to cart"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              {step === 'shipping' ? (
                <>
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  Delivery Details
                </>
              ) : (
                <>
                  <ShoppingBag className="h-5 w-5 text-emerald-600" />
                  Your Basket
                </>
              )}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {orderConfirmation ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <CheckCircle2 className="mb-3 h-16 w-16 text-emerald-600" />
              <h3 className="text-xl font-bold text-slate-900">Order Placed!</h3>
              <p className="mt-1 text-sm text-slate-500">
                Order Ref:{' '}
                <span className="font-mono font-semibold">{orderConfirmation}</span>
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-slate-500">
              <ShoppingBag className="mb-3 h-12 w-12 text-slate-300" />
              <p className="font-medium text-slate-700">Your basket is empty</p>
            </div>
          ) : step === 'cart' ? (
            /* STEP 1: CART ITEMS */
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3.5 border-b border-slate-100 pb-4 last:border-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 shrink-0 rounded-xl bg-slate-100 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="truncate text-sm font-semibold text-slate-900">
                        {item.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="cursor-pointer text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 p-0.5">
                        <button
                          type="button"
                          onClick={() => dispatch(decrementQuantity(item.id))}
                          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded hover:bg-slate-100"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-4 text-center text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => dispatch(addToCart(item))}
                          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded hover:bg-slate-100"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-slate-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            /* STEP 2: DELIVERY ADDRESS & PHONE FORM */
            <form id="shipping-form" onSubmit={handlePlaceOrder} className="space-y-4">
              <p className="text-xs text-slate-500">
                Enter your contact number and address so we can deliver your fresh vegetables.
              </p>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={shipping.phone}
                    onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Street Address / House No. *
                </label>
                <input
                  type="text"
                  required
                  placeholder="123 Green Valley Road, Apt 4B"
                  value={shipping.street}
                  onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Hyderabad"
                    value={shipping.city}
                    onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="500001"
                    value={shipping.postalCode}
                    onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="COD">Cash on Delivery (COD)</option>
                  <option value="UPI">UPI</option>
                  <option value="CARD">Credit / Debit Card</option>
                </select>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && !orderConfirmation && (
          <div className="space-y-3 border-t border-slate-200 bg-slate-50 p-6">
            {(validationError || error) && (
              <p className="rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-600">
                {validationError || error?.data?.message || 'Failed to place order.'}
              </p>
            )}
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Delivery</span>
              <span>
                {deliveryCost === 0 ? 'FREE' : `$${deliveryCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={handleProceedToShipping}
                className="w-full cursor-pointer rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                {!user
                  ? `Sign In to Checkout • $${total.toFixed(2)}`
                  : `Proceed to Checkout • $${total.toFixed(2)}`}
              </button>
            ) : (
              <button
                type="submit"
                form="shipping-form"
                disabled={isLoading}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  `Confirm & Place Order • $${total.toFixed(2)}`
                )}
              </button>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}