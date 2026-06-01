import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Zap } from 'lucide-react';

const PromotionBanner = ({ onScrollToVouchers, targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const now = new Date();
    const finalTarget = targetDate
      ? new Date(targetDate)
      : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const timer = setInterval(() => {
      const diff = finalTarget.getTime() - new Date().getTime();
      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white/15 border border-white/25 backdrop-blur-sm w-14 h-14 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center mb-1.5 shadow-inner">
        <span className="text-2xl sm:text-3xl font-black text-white tabular-nums leading-none">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] sm:text-xs font-bold text-white/60 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );

  const Separator = () => (
    <span className="text-white/40 text-2xl font-black self-start mt-2">:</span>
  );

  return (
    <section className="relative w-full py-16 sm:py-24 px-4 overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500">
      {/* Background decor */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')] opacity-[0.06]" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-teal-400/20 rounded-full blur-2xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-3xl" />

      {/* Floating icons */}
      <motion.div
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 right-[20%] text-white/10"
      >
        <Leaf size={56} />
      </motion.div>

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-white font-bold text-xs sm:text-sm mb-6 backdrop-blur-sm"
          >
            <Zap size={13} className="text-yellow-300" />
            CHƯƠNG TRÌNH KHUYẾN MÃI LỚN NHẤT THÁNG
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-none mb-4 tracking-tighter"
          >
            TƯƠI TỪ VƯỜN{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-yellow-300">
              RẺ TỪ TÂM
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/75 text-base sm:text-lg max-w-xl mb-10 leading-relaxed"
          >
            Nông sản sạch từ vườn đến tay bạn — cùng hàng trăm voucher đang chờ được săn!
          </motion.p>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center mb-10"
          >
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">
              Ưu đãi kết thúc sau
            </p>
            <div className="flex items-center gap-3 sm:gap-4">
              <TimeUnit value={timeLeft.days} label="Ngày" />
              <Separator />
              <TimeUnit value={timeLeft.hours} label="Giờ" />
              <Separator />
              <TimeUnit value={timeLeft.minutes} label="Phút" />
              <Separator />
              <TimeUnit value={timeLeft.seconds} label="Giây" />
            </div>
          </motion.div>

          {/* CTA */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onScrollToVouchers}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 sm:px-12 py-4 sm:py-4.5 rounded-2xl font-black text-base sm:text-lg transition-all shadow-xl shadow-orange-600/30 flex items-center gap-2.5 cursor-pointer"
          >
            <Zap size={20} className="fill-white" />
            SĂN VOUCHER NGAY
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default PromotionBanner;
