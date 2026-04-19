import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

const CartSidebar = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemove, onCheckout }) => {
  // Tính tổng tiền
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
            onClick={onClose}
          />
          
          {/* Sidebar Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full sm:max-w-md h-full bg-white shadow-2xl flex flex-col z-10"
          >
            {/* Header */}
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-white text-slate-800">
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <ShoppingBag size={20} className="text-brand-600 sm:w-6 sm:h-6" />
                Giỏ Hàng
              </h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body: Items Loop */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-100 rounded-full flex items-center justify-center">
                    <ShoppingBag size={32} className="text-slate-300 sm:w-10 sm:h-10" />
                  </div>
                  <p className="text-base sm:text-lg font-medium">Giỏ hàng của bạn đang trống</p>
                  <button onClick={onClose} className="text-brand-600 hover:text-brand-700 font-bold transition-colors text-sm sm:text-base">
                    Tiếp tục mua sắm
                  </button>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <AnimatePresence>
                    {cartItems.map(item => (
                      <motion.div 
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                        className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 sm:gap-4"
                      >
                        {/* Thumbnail */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden bg-slate-100 shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm sm:text-base text-slate-800 line-clamp-1">{item.name}</h3>
                          <div className="text-brand-600 font-bold text-xs sm:text-sm mt-0.5 sm:mt-1">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                          </div>
                          
                          <div className="flex items-center justify-between mt-2 sm:mt-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 sm:p-1 gap-2 sm:gap-3">
                              <button 
                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center rounded-md bg-white hover:bg-slate-50 text-slate-600 shadow-sm transition-colors"
                              >
                                <Minus size={12} className="sm:w-[14px] sm:h-[14px]" />
                              </button>
                              <span className="font-bold text-xs sm:text-sm text-slate-700 min-w-[16px] text-center">{item.quantity}</span>
                              <button 
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center rounded-md bg-white hover:bg-slate-50 text-slate-600 shadow-sm transition-colors"
                              >
                                <Plus size={12} className="sm:w-[14px] sm:h-[14px]" />
                              </button>
                            </div>

                            {/* Remove */}
                            <button 
                              onClick={() => onRemove(item.id)}
                              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={14} className="sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer: Summary & Checkout */}
            {cartItems.length > 0 && (
              <div className="border-t border-slate-100 p-4 sm:p-6 bg-white shrink-0 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-slate-500 font-medium text-sm sm:text-base">Tạm tính:</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                  </span>
                </div>
                <button
                  onClick={() => { onClose(); onCheckout?.(); }}
                  className="w-full py-3.5 sm:py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-base sm:text-lg transition-all shadow-lg shadow-brand-500/30 hover:-translate-y-1 active:scale-[0.98]">
                  Thanh Toán Ngay
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
