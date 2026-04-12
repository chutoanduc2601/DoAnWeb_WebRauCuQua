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
            className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col z-10"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white text-slate-800">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag size={24} className="text-brand-600" />
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
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center">
                    <ShoppingBag size={40} className="text-slate-300" />
                  </div>
                  <p className="text-lg font-medium">Giỏ hàng của bạn đang trống</p>
                  <button onClick={onClose} className="text-brand-600 hover:text-brand-700 font-bold transition-colors">
                    Tiếp tục mua sắm
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {cartItems.map(item => (
                      <motion.div 
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                        className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
                      >
                        {/* Thumbnail */}
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-800 line-clamp-1">{item.name}</h3>
                          <div className="text-brand-600 font-bold text-sm mt-1">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center bg-slate-100 rounded-lg p-1 gap-3">
                              <button 
                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center rounded-md bg-white hover:bg-slate-50 text-slate-600 shadow-sm transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="font-bold text-sm text-slate-700 min-wRef={4} text-center">{item.quantity}</span>
                              <button 
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center rounded-md bg-white hover:bg-slate-50 text-slate-600 shadow-sm transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            {/* Remove */}
                            <button 
                              onClick={() => onRemove(item.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={16} />
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
              <div className="border-t border-slate-100 p-6 bg-white shrink-0 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 font-medium">Tạm tính:</span>
                  <span className="text-2xl font-extrabold text-slate-900">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                  </span>
                </div>
                <button
                  onClick={() => { onClose(); onCheckout?.(); }}
                  className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-brand-500/30 hover:-translate-y-1 active:scale-[0.98]">
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
