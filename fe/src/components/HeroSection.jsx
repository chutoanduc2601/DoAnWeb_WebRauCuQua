import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-[90vh] flex items-center justify-center pt-20 sm:pt-24 pb-8 sm:pb-12 overflow-hidden bg-slate-50">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] sm:w-[40%] h-[40%] bg-brand-200 rounded-full blur-[80px] sm:blur-[100px] opacity-40 mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] sm:w-[50%] h-[50%] bg-emerald-100 rounded-full blur-[100px] sm:blur-[120px] opacity-50 mix-blend-multiply"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        
        {/* Text Content */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start gap-4 sm:gap-6 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 font-medium text-xs sm:text-sm"
          >
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
            100% Nông Sản Sạch
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-slate-900 tracking-tight"
          >
            Ăn Xanh - Sống Khỏe <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-emerald-400">
              Tầm Nhìn Xa
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl text-slate-600 max-w-lg leading-relaxed"
          >
            Nâng tầm lối sống lành mạnh với nguồn thực phẩm chất lượng cao. FreshGarden mang đến giải pháp dinh dưỡng tối ưu cho thế hệ mới.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-2 sm:mt-4 w-full sm:w-auto"
          >
            <button className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:-translate-y-1">
              Mua Ngay
            </button>
            <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
              Tìm Hiểu Thêm
            </button>
          </motion.div>
        </div>

        {/* Video / Visual Asset Placeholder */}
        <div className="w-full md:w-1/2 flex justify-center mt-4 sm:mt-6 md:mt-0">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
            className="w-full aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl relative bg-slate-200 border border-white/40"
          >
            {/* Cinematic Placeholder Image (acts as video thumbnail) */}
            <img 
              src="https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=2070&auto=format&fit=crop" 
              alt="Rau củ quả tươi sạch" 
              className="w-full h-full object-cover"
            />
            
            {/* Play Button Overlay (just for visual representation) */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center group cursor-pointer hover:bg-black/30 transition-colors">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full glass flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <div className="w-0 h-0 border-y-[10px] sm:border-y-[12px] border-y-transparent border-l-[16px] sm:border-l-[20px] border-l-brand-600 ml-1.5 sm:ml-2"></div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
