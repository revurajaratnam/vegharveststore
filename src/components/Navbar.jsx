import { useDispatch, useSelector } from 'react-redux';
import { Leaf, Search, ShoppingBag, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { selectSearchQuery, setSearchQuery } from '../store/slices/productsSlice';
import { selectCartCount, toggleCart } from '../store/slices/cartSlice';
import { selectCurrentUser, logout } from '../store/slices/authSlice';

export default function Navbar({ onOpenAuth, onNavigate, currentView }) {
  const dispatch = useDispatch();
  const searchQuery = useSelector(selectSearchQuery);
  const cartCount = useSelector(selectCartCount);
  const user = useSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
    onNavigate('store');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          onClick={() => onNavigate('store')}
          className="flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Veg<span className="text-emerald-600">Harvest</span>
          </span>
        </button>

        {/* Search Input */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search organic spinach, tomatoes, carrots..."
            className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => dispatch(setSearchQuery(''))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          
          )}
        </div>

        {/* Right Actions: Auth + Cart */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <>
              <button
                onClick={() => onNavigate(user.role === 'admin' ? 'admin' : 'user')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
                  currentView === 'admin' || currentView === 'user'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {user.role === 'admin' ? 'Admin Panel' : user.name}
                </span>
              </button>

              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-sm font-semibold transition cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}

          {/* Cart Trigger */}
          <button
            onClick={() => dispatch(toggleCart())}
            className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition shadow-sm cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="min-w-5 h-5 px-1.5 rounded-full bg-amber-400 text-slate-900 text-xs font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
        <p></p>
      </div>
    </header>
  );
}