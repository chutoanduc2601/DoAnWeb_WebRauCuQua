import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const mockSales = [
  { id: 1, name: 'Súp lơ xanh Đà Lạt', time: '2 phút trước', image: 'https://img.freepik.com/free-photo/fresh-broccoli-isolated-white-background_1232-1596.jpg' },
  { id: 2, name: 'Cà rốt hữu cơ', time: '5 phút trước', image: 'https://img.freepik.com/free-photo/carrots-isolated-white-background_1232-1574.jpg' },
  { id: 3, name: 'Cà chua chín mọng', time: '12 phút trước', image: 'https://img.freepik.com/free-photo/fresh-tomato-isolated-white-background_1232-1582.jpg' },
  { id: 4, name: 'Hành tím Lý Sơn', time: '15 phút trước', image: 'https://img.freepik.com/free-photo/red-onion-isolated-white-background_1232-1587.jpg' },
  { id: 5, name: 'Tỏi cô đơn Sơn La', time: '20 phút trước', image: 'https://img.freepik.com/free-photo/garlic-isolated-white-background_1232-1589.jpg' }
];

const SalesNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);

  useEffect(() => {
    // Hiển thị thông báo đầu tiên sau 5 giây
    const firstShow = setTimeout(() => {
      showRandomSale();
    }, 5000);

    return () => clearTimeout(firstShow);
  }, []);

  const showRandomSale = () => {
    const randomIdx = Math.floor(Math.random() * mockSales.length);
    setCurrentSale(mockSales[randomIdx]);
    setIsVisible(true);

    // Tự động ẩn sau 6 giây
    setTimeout(() => {
      setIsVisible(false);
      // Lên lịch hiển thị cái tiếp theo sau 10-20 giây
      const nextDelay = 10000 + Math.random() * 10000;
      setTimeout(showRandomSale, nextDelay);
    }, 6000);
  };

  return (
    <AnimatePresence>
      {isVisible && currentSale && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="fixed bottom-6 left-6 z-[250] bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 flex items-center gap-4 max-w-[320px] group"
        >
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 text-slate-300 hover:text-slate-500 transition-colors"
          >
            <X size={14} />
          </button>

          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 shrink-0">
            <img 
              src={currentSale.image} 
              alt={currentSale.name} 
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex-1 min-w-0 pr-4">
            <h4 className="text-sm font-bold text-slate-800 line-clamp-1 mb-0.5">
              {currentSale.name}
            </h4>
            <p className="text-xs text-slate-500 leading-tight">
              Một khách hàng vừa đặt mua cách đây {currentSale.time}
            </p>
          </div>
          
          <div className="absolute -bottom-1 left-4 w-4 h-4 bg-white rotate-45 border-r border-b border-slate-100 -z-10" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SalesNotification;
