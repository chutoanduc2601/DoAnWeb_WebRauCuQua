import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
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
import AdminLayout from './admin/AdminLayout';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function UserApp() {
  const navigate = useNavigate();
  const { profile, signOut, isAdmin, isAuthenticated, loading } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [view, setView] = useState('home');

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existingProduct = prev.find(item => item.id === product.id);
      if (existingProduct) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
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
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const totalCartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  const handleGoToCheckout = () => {
    setView('checkout');
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Tạo user object tương thích với Navbar
  const currentUser = isAuthenticated && profile ? {
    name: profile.name || profile.email?.split('@')[0] || 'User',
    email: profile.email,
    role: profile.role === 'admin' ? 'ADMIN' : 'USER',
  } : null;

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-brand-500 selection:text-white">
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
          >
            <Navbar
              cartItemCount={totalCartItemsCount}
              onOpenCart={() => setIsCartOpen(true)}
              user={currentUser}
              onOpenAuth={() => setIsAuthOpen(true)}
              onLogout={handleLogout}
            />

            <main>
              <HeroSection />
              <StorySection />
              <Shop
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
              />
            </main>

            <Footer />

            <ProductDetail
              product={selectedProduct}
              isOpen={!!selectedProduct}
              onClose={closeProductDetail}
              onAddToCart={handleAddToCart}
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
          </motion.div>
        )}

        {view === 'checkout' && (
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
                setView('home');
                setIsCartOpen(true);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/*" element={<UserApp />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
