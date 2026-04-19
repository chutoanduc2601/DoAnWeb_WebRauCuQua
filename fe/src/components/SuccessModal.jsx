import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, PackageSearch, Leaf, Sparkles } from 'lucide-react';

/* ── Generate a random order ID once per mount ── */
const makeOrderId = () => {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `#FG-${num}`;
};

const SuccessModal = ({ isOpen, cartItems = [] }) => {
  const [orderId] = useState(makeOrderId);
  const [step, setStep] = useState(0); // 0 = animating, 1 = content visible

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setStep(1), 900);
      return () => clearTimeout(t);
    }
    setStep(0);
  }, [isOpen]);

  const handleContinue = () => {
    window.location.reload(); // simplest way to go back to shop
  };

  const handleTrack = () => {
    alert(`Đơn hàng ${orderId} đang được chuẩn bị. Tính năng theo dõi sẽ ra mắt sớm! 🚚`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="success-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-4"
          style={{ background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(12px)' }}
        >
          {/* Floating confetti dots */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full pointer-events-none"
              style={{
                background: ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#f59e0b', '#a3e635'][i % 6],
                left: `${10 + (i * 7.5) % 80}%`,
                top: `${5 + (i * 11) % 30}%`,
              }}
              initial={{ y: 0, opacity: 0, scale: 0 }}
              animate={{
                y: [0, -80, -40, -100],
                opacity: [0, 1, 1, 0],
                scale: [0, 1, 0.8, 0],
                rotate: [0, 180, 270, 360],
              }}
              transition={{ delay: 0.3 + i * 0.07, duration: 1.8, ease: 'easeOut' }}
            />
          ))}

          {/* Modal card */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.1 }}
            className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Green gradient top strip */}
            <div className="h-1.5 sm:h-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500" />

            <div className="px-5 sm:px-8 py-6 sm:py-10 text-center">

              {/* ── Checkmark animation ── */}
              <div className="flex items-center justify-center mb-5 sm:mb-8">
                <div className="relative w-20 h-20 sm:w-28 sm:h-28">
                  {/* Pulsing rings */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-emerald-100"
                    animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute inset-1.5 sm:inset-2 rounded-full bg-emerald-200"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut', delay: 0.3 }}
                  />

                  {/* Circle bg */}
                  <motion.div
                    className="absolute inset-3 sm:inset-4 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-300"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.2 }}
                  />

                  {/* SVG checkmark drawn with stroke-dashoffset animation */}
                  <svg
                    className="absolute inset-3 sm:inset-4 w-[calc(100%-1.5rem)] h-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] sm:h-[calc(100%-2rem)]"
                    viewBox="0 0 60 60"
                    fill="none"
                  >
                    <motion.path
                      d="M14 30 L24 42 L46 18"
                      stroke="white"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.55, ease: 'easeOut' }}
                    />
                  </svg>
                </div>
              </div>

              {/* Content reveals after check */}
              <AnimatePresence>
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="flex items-center justify-center gap-1.5 mb-2 sm:mb-3">
                      <Sparkles size={12} className="text-amber-400 sm:w-[14px] sm:h-[14px]" />
                      <span className="text-[10px] sm:text-xs font-bold text-amber-500 uppercase tracking-widest">Thành công!</span>
                      <Sparkles size={12} className="text-amber-400 sm:w-[14px] sm:h-[14px]" />
                    </div>

                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 leading-tight mb-1.5 sm:mb-2">
                      Đặt hàng thành công! 🎉
                    </h2>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
                      Đơn hàng của bạn đang được chuẩn bị.
                      <br />
                      FreshGarden sẽ giao tươi đến tận cửa nhà bạn!
                    </p>

                    {/* Order ID chip */}
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold mb-4 sm:mb-6 shadow-sm">
                      <Leaf size={13} className="text-emerald-500 sm:w-[15px] sm:h-[15px]" />
                      Mã đơn: <span className="font-mono tracking-wider">{orderId}</span>
                    </div>

                    {/* Mini order summary */}
                    {cartItems.length > 0 && (
                      <div className="bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 px-3 sm:px-4 py-2.5 sm:py-3 mb-5 sm:mb-7 text-left space-y-2">
                        {cartItems.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center gap-2 sm:gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover"
                            />
                            <p className="flex-1 text-slate-700 text-[11px] sm:text-xs font-medium line-clamp-1">{item.name}</p>
                            <span className="text-emerald-600 text-[11px] sm:text-xs font-bold">×{item.quantity}</span>
                          </div>
                        ))}
                        {cartItems.length > 3 && (
                          <p className="text-[10px] sm:text-xs text-slate-400 text-center pt-1">
                            +{cartItems.length - 3} sản phẩm khác
                          </p>
                        )}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                      <motion.button
                        onClick={handleContinue}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex-1 flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border-2 border-slate-200 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
                      >
                        <ShoppingBag size={14} className="sm:w-4 sm:h-4" /> Tiếp tục mua sắm
                      </motion.button>
                      <motion.button
                        onClick={handleTrack}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex-1 flex items-center justify-center gap-2 py-3 sm:py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-emerald-400/35 transition-all"
                      >
                        <PackageSearch size={14} className="sm:w-4 sm:h-4" /> Theo dõi đơn hàng
                      </motion.button>
                    </div>

                    {/* Footer tag */}
                    <p className="mt-4 sm:mt-6 text-[10px] sm:text-xs text-slate-400 font-mono">
                      Built by Duc @UIT 🌿
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
