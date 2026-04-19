import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Leaf, User, Menu, X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navbar = ({ cartItemCount, onOpenCart, onOpenAuth, user, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Trang Chủ', href: '#home' },
    { label: 'Sản Phẩm', href: '#shop' },
    { label: 'Câu Chuyện', href: '#about' },
  ];

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2 sm:py-3' : 'py-3 sm:py-5'}`}
      >
        <div className="container mx-auto px-3 sm:px-4 md:px-8">
          <div className={`flex items-center justify-between rounded-2xl px-4 sm:px-6 py-2.5 sm:py-3 transition-all duration-300 ${scrolled ? 'glass' : 'bg-transparent text-slate-800'}`}>
            
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer text-brand-600">
              <Leaf size={24} className="text-brand-600 sm:w-7 sm:h-7" />
              <span className="font-bold text-lg sm:text-xl tracking-tight">FreshGarden</span>
            </div>

            {/* Nav Links (Desktop) */}
            <div className="hidden md:flex items-center gap-8 font-medium">
              {navLinks.map(link => (
                <a key={link.href} href={link.href} className="hover:text-brand-600 transition-colors">{link.label}</a>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-4 text-slate-700">
              <button className="p-2 hover:bg-slate-100 rounded-full transition-colors hidden sm:block">
                <Search size={20} className="sm:w-[22px] sm:h-[22px]" />
              </button>

              {user ? (
                <>
                  {user.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs sm:text-sm font-semibold cursor-pointer"
                      title="Trang Admin"
                    >
                      <Shield size={16} />
                      <span className="hidden sm:inline">Admin</span>
                    </Link>
                  )}
                  <div className="flex items-center gap-2 group relative cursor-pointer ml-1 sm:ml-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs sm:text-sm">
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
                </>
              ) : (
                <button 
                  onClick={onOpenAuth}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  title="Đăng Nhập"
                >
                  <User size={20} className="sm:w-[22px] sm:h-[22px]" />
                </button>
              )}

              <button 
                onClick={onOpenCart}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors relative ml-0.5 sm:ml-1"
                title="Mở Giỏ Hàng"
              >
                <ShoppingCart size={20} className="sm:w-[22px] sm:h-[22px]" />
                {cartItemCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={cartItemCount}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    className="absolute -top-0.5 -right-0.5 sm:top-0 sm:right-0 bg-brand-500 text-white text-[10px] sm:text-xs font-bold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full"
                  >
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </motion.span>
                )}
              </button>

              {/* Mobile Hamburger */}
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors md:hidden ml-0.5"
                title="Menu"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[300] md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Slide-in panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl flex flex-col"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <div className="flex items-center gap-2 text-brand-600">
                  <Leaf size={24} />
                  <span className="font-bold text-lg">FreshGarden</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Menu Links */}
              <nav className="flex-1 p-5">
                <ul className="space-y-1">
                  {navLinks.map((link, idx) => (
                    <motion.li 
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                    >
                      <a 
                        href={link.href} 
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-brand-50 hover:text-brand-600 transition-colors"
                      >
                        {link.label}
                      </a>
                    </motion.li>
                  ))}
                </ul>

                {/* Search in mobile */}
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">
                    <Search size={18} />
                    <span className="font-medium">Tìm kiếm</span>
                  </button>
                </div>
              </nav>

              {/* Mobile Menu Footer */}
              <div className="p-5 border-t border-slate-100">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                      className="w-full py-2.5 text-sm text-red-600 font-semibold bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                    >
                      Đăng Xuất
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                    className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-colors"
                  >
                    Đăng Nhập / Đăng Ký
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
