import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StorySection from './components/StorySection';
import Shop from './components/Shop';
import ProductDetail from './components/ProductDetail';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import CartSidebar from './components/CartSidebar';
import Checkout from './components/Checkout';
import OrderHistory from './components/OrderHistory';
import UserProfile from './components/UserProfile';
import SalesNotification from './components/SalesNotification';
import PromotionsUser from './components/PromotionsUser';
import ChatWidget from './components/ChatWidget';
import AdminLayout from './admin/AdminLayout';
import ResetPassword from './components/ResetPassword';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function UserApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut, isAdmin, isAuthenticated, loading } = useAuth();

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('farmily_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Lưu giỏ hàng vào localStorage khi có thay đổi
  useEffect(() => {
    localStorage.setItem('farmily_cart', JSON.stringify(cartItems));
  }, [cartItems]);


  const handleAddToCart = (product) => {
    const qtyToAdd = product.quantity || 1;
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      let newCart;
      if (existing) {
        newCart = prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + (product.quantity || 1) } : i);
      } else {
        newCart = [...prev, { ...product, quantity: product.quantity || 1 }];
      }
      toast.success(`Đã thêm ${product.name} vào giỏ hàng!`, {
        icon: '🛒',
        style: {
          borderRadius: '16px',
          background: '#334155',
          color: '#fff',
          fontWeight: '600'
        }
      });
      return newCart;
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev =>
      prev.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item)
    );
  };

  const handleRemoveFromCart = (productId) => {
    const item = cartItems.find(i => i.id === productId);
    setCartItems(prev => prev.filter(item => item.id !== productId));
    if (item) {
      toast.error(`Đã xóa ${item.name} khỏi giỏ hàng`, {
        icon: '🗑️',
        style: { borderRadius: '12px', background: '#EF4444', color: '#fff' }
      });
    }
  };

  const totalCartItemsCount = cartItems.length;

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  const handleGoToCheckout = () => {
    navigate('/checkout');
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Tạo user object tương thích với Navbar
  const currentUser = isAuthenticated && (profile || user) ? {
    name: profile?.name || user?.email?.split('@')[0] || 'User',
    email: user?.email || profile?.email || '',
    role: profile?.role === 'admin' ? 'ADMIN' : 'USER',
  } : null;

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-brand-500 selection:text-white">
      <Toaster position="bottom-right" />
      
      <Navbar
        cartItemCount={totalCartItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
        user={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenHistory={() => navigate('/history')}
        onOpenProfile={() => navigate('/profile')}
        onOpenPromotions={() => navigate('/promotion')}
        onGoHome={() => navigate('/home')}
      />

      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            
            <Route path="/home" element={
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35 }}
              >
                <HeroSection />
                <StorySection />
                <Shop
                  onAddToCart={handleAddToCart}
                  onProductClick={handleProductClick}
                />
              </motion.div>
            } />
            
            <Route path="/shop" element={
              <motion.div
                key="shop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35 }}
                className="pt-24 pb-12"
              >
                <Shop
                  onAddToCart={handleAddToCart}
                  onProductClick={handleProductClick}
                />
              </motion.div>
            } />
            
            <Route path="/promotion" element={
              <motion.div
                key="promotion"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <PromotionsUser onBack={() => navigate('/home')} />
              </motion.div>
            } />
            
            <Route path="/about" element={
              <motion.div
                key="about"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="pt-20"
              >
                <StorySection />
              </motion.div>
            } />
            
            <Route path="/checkout" element={
              <motion.div
                key="checkout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Checkout
                  cartItems={cartItems}
                  onBack={() => {
                    navigate('/home');
                    setIsCartOpen(true);
                  }}
                  onSuccess={(action) => {
                    setCartItems([]);
                    toast.success('Đặt hàng thành công! Cảm ơn bạn đã tin dùng Farmily.', {
                      duration: 5000,
                      icon: '🎉',
                      style: { borderRadius: '16px', background: '#064E3B', color: '#fff' }
                    });
                    if (action === 'track') {
                      navigate('/history');
                    } else {
                      navigate('/home');
                    }
                  }}
                />
              </motion.div>
            } />
            
            <Route path="/history" element={
              <motion.div
                key="history"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.3 }}
              >
                <OrderHistory onBack={() => navigate('/home')} />
              </motion.div>
            } />
            
            <Route path="/profile" element={
              <motion.div
                key="profile"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <UserProfile />
              </motion.div>
            } />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />

      <ProductDetail
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={closeProductDetail}
        onAddToCart={handleAddToCart}
        onProductClick={handleProductClick}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveFromCart}
        onCheckout={handleGoToCheckout}
      />

      <SalesNotification />
      <ChatWidget />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/*" element={<UserApp />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
