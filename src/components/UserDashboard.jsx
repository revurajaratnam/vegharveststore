import { useState } from 'react';
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Receipt,
  RotateCcw,
  Star,
} from 'lucide-react';
import {
  useGetMyOrdersQuery,
  useCancelOrderMutation,
  useReturnOrderMutation,
} from '../store/api/ecommerceApi';
import ReviewModal from './ReviewModal';

const STATUS_STYLE = {
  Pending: 'bg-amber-100 text-amber-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-indigo-100 text-indigo-800',
  Delivered: 'bg-emerald-100 text-emerald-800',
  Cancelled: 'bg-rose-100 text-rose-800',
  'Return Requested': 'bg-orange-100 text-orange-800',
  Returned: 'bg-slate-200 text-slate-700',
};

export default function UserDashboard() {
  const { data: orders = [], isLoading, isError, refetch } = useGetMyOrdersQuery();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [returnOrder, { isLoading: isReturning }] = useReturnOrderMutation();

  const [reviewItem, setReviewItem] = useState(null);

  const totalSpent = orders
    .filter((o) => !['Cancelled', 'Returned'].includes(o.status))
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);

  const activeOrdersCount = orders.filter((o) =>
    ['Pending', 'Confirmed', 'Shipped'].includes(o.status)
  ).length;

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await cancelOrder(orderId).unwrap();
    } catch (err) {
      alert(err?.data?.message || 'Failed to cancel order');
    }
  };

  const handleReturnOrder = async (orderId) => {
    const reason = window.prompt(
      'Please enter the reason for returning this order (e.g., Damaged, Not fresh):'
    );
    if (!reason || !reason.trim()) return;

    try {
      await returnOrder({ orderId, reason: reason.trim() }).unwrap();
      alert('Return request submitted successfully.');
    } catch (err) {
      alert(err?.data?.message || 'Failed to submit return request');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Account & Orders</h1>
        <p className="text-sm text-slate-500">
          Track deliveries, cancel pending orders, request returns, and review your fresh produce.
        </p>
      </div>

      {/* User Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Orders</p>
            <p className="text-xl font-bold text-slate-900">{orders.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Active Deliveries</p>
            <p className="text-xl font-bold text-slate-900">{activeOrdersCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Spent</p>
            <p className="text-xl font-bold text-slate-900">${totalSpent.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Order History</h2>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-rose-200">
            <p className="text-rose-600 text-sm font-medium">Failed to load your orders.</p>
            <button
              onClick={refetch}
              className="mt-3 px-4 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-semibold cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            You haven&apos;t placed any orders yet.
          </div>
        ) : (
          orders.map((order) => {
            const canCancel = ['Pending', 'Confirmed'].includes(order.status);
            const isDelivered = order.status === 'Delivered';

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4"
              >
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="font-mono font-bold text-slate-900">
                      {order.orderId}
                    </span>
                    <span className="ml-3 text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        STATUS_STYLE[order.status] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {order.status}
                    </span>

                    {canCancel && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={isCancelling}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel Order
                      </button>
                    )}

                    {isDelivered && (
                      <button
                        onClick={() => handleReturnOrder(order.id)}
                        disabled={isReturning}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 cursor-pointer disabled:opacity-50"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Return Product
                      </button>
                    )}
                  </div>
                </div>

                {/* Return Reason Banner (if requested) */}
                {order.returnReason && (
                  <div className="px-3 py-2 rounded-lg bg-orange-50 border border-orange-200 text-xs text-orange-800">
                    <strong>Return Reason:</strong> {order.returnReason}
                  </div>
                )}

                {/* Items List with Review Trigger */}
                <ul className="divide-y divide-slate-100 text-sm">
                  {order.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="py-2.5 flex flex-wrap items-center justify-between gap-2 text-slate-700"
                    >
                      <span>
                        {item.quantity}x <strong>{item.name}</strong>
                      </span>

                      <div className="flex items-center gap-4">
                        {isDelivered && (
                          <button
                            onClick={() => setReviewItem(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold transition cursor-pointer"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            Write Review
                          </button>
                        )}
                        <span className="font-medium">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Footer Total */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Payment: {order.paymentMethod}
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    Total: ${Number(order.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Product Review & Photo Upload Modal */}
      {reviewItem && (
        <ReviewModal
          product={reviewItem}
          onClose={() => setReviewItem(null)}
        />
      )}
    </div>
  );
}