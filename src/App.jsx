import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/cartDrawer';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import { selectCurrentUser } from './store/slices/authSlice';
import { toggleCart } from './store/slices/cartSlice';
import ToastContainer from './components/ToastContainer';

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const [view, setView] = useState('store'); // 'store' | 'user' | 'admin'
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [returnToCartAfterAuth, setReturnToCartAfterAuth] = useState(false);

  const handleRequireAuthFromCart = () => {
    setReturnToCartAfterAuth(true);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (loggedInUser) => {
    if (returnToCartAfterAuth) {
      setReturnToCartAfterAuth(false);
      setView('store');
      dispatch(toggleCart()); // Reopen basket so they can finish buying
      return;
    }

    setView(loggedInUser.role === 'admin' ? 'admin' : 'user');
  };

  const handleCloseAuth = () => {
    setIsAuthOpen(false);
    setReturnToCartAfterAuth(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar
        currentView={view}
        onNavigate={setView}
        onOpenAuth={() => {
          setReturnToCartAfterAuth(false);
          setIsAuthOpen(true);
        }}
      />

      {view === 'store' && (
        <>
          <Hero />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <FilterBar />
            <ProductGrid />
          </main>
        </>
      )}

      {view === 'user' && user && (
        <main className="flex-1">
          <UserDashboard />
        </main>
      )}

      {view === 'admin' && user?.role === 'admin' && (
        <main className="flex-1">
          <AdminDashboard />
        </main>
      )}

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} FreshHarvest Organics. All rights reserved.
      </footer>

      {/* Cart Drawer wired to open AuthModal when guest clicks Buy Now */}
      <CartDrawer onRequireAuth={handleRequireAuthFromCart} />

      {/* Sign In / Sign Up / Forgot Password Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={handleCloseAuth}
        onAuthSuccess={handleAuthSuccess}
      />
      <CartDrawer onRequireAuth={handleRequireAuthFromCart} />
<AuthModal isOpen={isAuthOpen} onClose={handleCloseAuth} onAuthSuccess={handleAuthSuccess} />
<ToastContainer />
    </div>
  );
}