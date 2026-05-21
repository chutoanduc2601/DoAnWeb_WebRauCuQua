import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';

const mockSales = [
  { 
    id: 'm1', 
    name: 'Súp lơ xanh Đà Lạt', 
    time: '2 phút trước', 
    image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?q=80&w=200&auto=format&fit=crop' 
  },
  { 
    id: 'm2', 
    name: 'Cà rốt hữu cơ', 
    time: '5 phút trước', 
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=200&auto=format&fit=crop' 
  },
  { 
    id: 'm3', 
    name: 'Tỏi cô đơn Sơn La', 
    time: '20 phút trước', 
    image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?q=80&w=200&auto=format&fit=crop' 
  }
];

const API_URL = 'http://localhost:8082';

const SalesNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);

  useEffect(() => {
    const handleNewOrderEvent = (order) => {
      if (order && order.items && order.items.length > 0) {
        const firstItem = order.items[0];
        const newSale = {
          id: order.id || Math.random().toString(),
          name: firstItem.name,
          time: 'vừa xong',
          image: firstItem.image || 'https://via.placeholder.com/150',
          isReal: true,
          isMine: order.isMine || false
        };
        
        setCurrentSale(newSale);
        setIsVisible(true);
        setTimeout(() => setIsVisible(false), 8000);
      }
    };

    // 1. Listen for REAL-TIME orders via SSE
    const eventSource = new EventSource(`${API_URL}/api/orders/notifications`);

    eventSource.addEventListener('new-order', (event) => {
      try {
        const order = JSON.parse(event.data);
        handleNewOrderEvent(order);
      } catch (err) {
        console.error("Error parsing real-time order:", err);
      }
    });

    eventSource.onerror = (err) => {
      console.warn("SSE Connection failed, falling back to mock rotation.");
      eventSource.close();
    };

    // Listen for local order placement
    const handleLocalOrder = (e) => {
      if (e.detail) {
        handleNewOrderEvent(e.detail);
      }
    };
    window.addEventListener('local-new-order', handleLocalOrder);

    // 2. Initial delay before starting mock rotation (if no real orders come in)
    const mockTimer = setTimeout(() => {
      if (!isVisible) showRandomMockSale();
    }, 5000);

    return () => {
      eventSource.close();
      clearTimeout(mockTimer);
      window.removeEventListener('local-new-order', handleLocalOrder);
    };
  }, []);

  const showRandomMockSale = () => {
    // If a real notification is already showing, don't interrupt it
    if (isVisible) return;

    const randomIdx = Math.floor(Math.random() * mockSales.length);
    setCurrentSale(mockSales[randomIdx]);
    setIsVisible(true);

    // Auto-hide mock after 7 seconds
    setTimeout(() => {
      setIsVisible(false);
      // Schedule next mock notification with random interval
      const nextDelay = 30000 + Math.random() * 30000;
      setTimeout(showRandomMockSale, nextDelay);
    }, 7000);
  };

  if (!currentSale) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ 
            type: 'spring', 
            damping: 20, 
            stiffness: 100 
          }}
          className="fixed bottom-8 left-8 z-[999] flex items-center gap-4 p-4 bg-white rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.1)] border border-slate-100 min-w-[320px] max-w-[360px] group"
        >
          {/* Close button */}
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-3 right-3 text-slate-300 hover:text-slate-500 transition-colors"
          >
            <X size={16} />
          </button>

          {/* Product Image */}
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 shrink-0">
            <img 
              src={currentSale.image} 
              alt={currentSale.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pr-4">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-1">
              {currentSale.name}
              <span className="inline-flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-full p-0.5">
                <CheckCircle size={10} fill="currentColor" fillOpacity={0.2} />
              </span>
            </h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              {currentSale.isMine ? 'Bạn' : 'Một khách hàng'} vừa đặt mua <br />
              cách đây {currentSale.time} {currentSale.isReal ? '' : 'trước'}
            </p>
          </div>
          
          {/* Subtle pointer decorative element */}
          <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white rotate-45 border-r border-b border-slate-100 -z-10" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SalesNotification;



