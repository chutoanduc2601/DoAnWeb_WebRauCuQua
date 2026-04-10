import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Leaf, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ cartItemCount, onOpenCart, onOpenAuth, user, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className={`flex items-center justify-between rounded-2xl px-6 py-3 transition-all duration-300 ${scrolled ? 'glass' : 'bg-transparent text-slate-800'}`}>
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer text-brand-600">
            <Leaf size={28} className={scrolled ? "text-brand-600" : "text-brand-600"} />
            <span className="font-bold text-xl tracking-tight hidden sm:block">FreshGarden</span>
          </div>

          {/* Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8 font-medium">
            <a href="#home" className="hover:text-brand-600 transition-colors">Trang Chủ</a>
            <a href="#shop" className="hover:text-brand-600 transition-colors">Sản Phẩm</a>
            <a href="#about" className="hover:text-brand-600 transition-colors">Câu Chuyện</a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4 text-slate-700">
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors hidden sm:block">
              <Search size={22} />
            </button>

            {user ? (
              <div className="flex items-center gap-2 group relative cursor-pointer ml-2">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-sm hidden lg:block text-slate-800">{user.name}</span>
                {/* Dropdown Logout (Simplified) */}
                <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button 
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 font-medium rounded-lg"
                  >
                    Đăng Xuất
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                title="Đăng Nhập"
              >
                <User size={22} />
              </button>
            )}

            <button 
              onClick={onOpenCart}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors relative ml-1"
              title="Mở Giỏ Hàng"
            >
              <ShoppingCart size={22} />
              {cartItemCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={cartItemCount}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute top-0 right-0 bg-brand-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
                >
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
