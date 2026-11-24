import { useState } from 'react';
import {
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  ClipboardList,
  Boxes,
  RotateCcw,
  Check,
  X,
} from 'lucide-react';
import {
  useGetAdminStatsQuery,
  useGetOrdersQuery,
  usePatchOrderStatusMutation,
} from '../store/api/ecommerceApi';
import AdminProductManager from './AdminProductManager';

const ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Return Requested',
  'Returned',
];

const STATUS_BADGE = {
  Pending: 'bg-amber-100 text-amber-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-indigo-100 text-indigo-800',
  Delivered: 'bg-emerald-100 text-emerald-800',
  Cancelled: 'bg-rose-100 text-rose-800',
  'Return Requested': 'bg-orange-100 text-orange-800',
  Returned: 'bg-slate-200 text-slate-700',
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'inventory'
  const [orderFilter, setOrderFilter] = useState('all'); // 'all' | 'returns'

  const { data: stats, isLoading: statsLoading } = useGetAdminStatsQuery();
  const { data: orders = [], isLoading: ordersLoading } = useGetOrdersQuery();
  const [patchOrderStatus, { isLoading: isUpdating }] = usePatchOrderStatusMutation();

  const returnRequestsCount = orders.filter(
    (o) => o.status === 'Return Requested'
  ).length;

  const displayedOrders =
    orderFilter === 'returns'
      ? orders.filter((o) => ['Return Requested', 'Returned'].includes(o.status))
      : orders;

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await patchOrderStatus({ orderId, status: newStatus }).unwrap();
    } catch (err) {
      alert(err?.data?.message || 'Failed to update order status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-sm text-slate-500">
            Monitor farm revenue, manage orders &amp; return requests, and update vegetable stock.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex bg-slate-200/70 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('orders')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Orders ({orders.length})
            {returnRequestsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold">
                {returnRequestsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Boxes className="w-4 h-4" />
            Inventory
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Revenue"
          value={statsLoading ? '...' : `$${(stats?.totalRevenue || 0).toFixed(2)}`}
          icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
          bg="bg-emerald-50"
        />
        <StatCard
          title="Total Orders"
          value={statsLoading ? '...' : stats?.totalOrders || 0}
          icon={<ShoppingBag className="w-5 h-5 text-blue-600" />}
          bg="bg-blue-50"
        />
        <StatCard
          title="Return Requests"
          value={ordersLoading ? '...' : returnRequestsCount}
          icon={<RotateCcw className="w-5 h-5 text-orange-600" />}
          bg="bg-orange-50"
        />
        <StatCard
          title="Out of Stock"
          value={statsLoading ? '...' : stats?.outOfStockCount || 0}
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
          bg="bg-amber-50"
        />
      </div>

      {/* Tab Content */}
      {activeTab === 'orders' ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-bold text-slate-900">Customer Orders</h2>

            {/* Order Filter Pills */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOrderFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  orderFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Orders ({orders.length})
              </button>
              <button
                onClick={() => setOrderFilter('returns')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  orderFilter === 'returns'
                    ? 'bg-orange-600 text-white'
                    : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Returns ({returnRequestsCount})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="p-4">Order ID &amp; Customer</th>
                  <th className="p-4">Items &amp; Return Reason</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ordersLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      Loading orders...
                    </td>
                  </tr>
                ) : displayedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      {orderFilter === 'returns'
                        ? 'No return requests right now.'
                        : 'No orders placed yet.'}
                    </td>
                  </tr>
                ) : (
                  displayedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/70 align-top">
                      <td className="p-4">
                        <p className="font-mono font-semibold text-slate-900">
                          {order.orderId}
                        </p>
                        {order.user?.name && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            {order.user.name}
                          </p>
                        )}
                      </td>

                      <td className="p-4 text-slate-600 space-y-1">
                        {order.items.map((item, idx) => (
                          <span key={idx} className="block text-xs">
                            {item.quantity}x {item.name}
                          </span>
                        ))}

                        {/* Return Reason Box */}
                        {order.returnReason && (
                          <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-xs text-orange-800 max-w-xs">
                            <span className="font-semibold">Return Reason:</span>{' '}
                            {order.returnReason}
                          </div>
                        )}
                      </td>

                      <td className="p-4 font-bold text-slate-900">
                        ${Number(order.totalAmount).toFixed(2)}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            STATUS_BADGE[order.status] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        {order.status === 'Return Requested' ? (
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => handleStatusChange(order.id, 'Returned')}
                              disabled={isUpdating}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(order.id, 'Delivered')}
                              disabled={isUpdating}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                            >
                              <X className="w-3.5 h-3.5" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <select
                            value={order.status}
                            disabled={isUpdating}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            {ORDER_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <AdminProductManager />
      )}
    </div>
  );
}

function StatCard({ title, value, icon, bg }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {title}
        </p>
        <p className="text-2xl font-extrabold text-slate-900 mt-1">{value}</p>
      </div>
      <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  );
}