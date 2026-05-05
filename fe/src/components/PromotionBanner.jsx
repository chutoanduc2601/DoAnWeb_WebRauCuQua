import React, { useState, useEffect } from 'react';

const PromotionBanner = ({ onScrollToVouchers, targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Default to end of month if no targetDate is provided
    const now = new Date();
    const finalTarget = targetDate ? new Date(targetDate) : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const timer = setInterval(() => {
      const currentTime = new Date();
      const difference = finalTarget.getTime() - currentTime.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white/10 border border-white/20 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-1 sm:mb-2">
        <span className="text-xl sm:text-3xl font-black text-white tabular-nums">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] sm:text-xs font-bold text-white/70 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );

  return (
    <section className="relative w-full py-12 sm:py-20 px-4 overflow-hidden bg-forest-green">
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white font-bold text-xs sm:text-sm mb-6">
            CHƯƠNG TRÌNH KHUYẾN MÃI LỚN NHẤT THÁNG
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-none mb-6 tracking-tighter">
            TƯƠI TỪ VƯỜN <br />
            <span className="text-lime-green">RẺ TỪ TÂM</span>
          </h1>

          <p className="text-white/80 text-lg sm:text-xl max-w-2xl mb-10 font-medium">
            Đưa nông sản sạch từ nông trại đến tận bàn ăn với mức giá ưu đãi nhất. 
            Cùng hàng ngàn voucher đang chờ bạn khám phá!
          </p>

          {/* Countdown Timer */}
          <div className="flex flex-col items-center mb-12">
            <div className="flex items-center gap-2 mb-4 text-white font-bold tracking-widest uppercase text-sm">
              Ưu đãi kết thúc sau
            </div>
            <div className="flex gap-3 sm:gap-6">
              <TimeUnit value={timeLeft.days} label="Ngày" />
              <TimeUnit value={timeLeft.hours} label="Giờ" />
              <TimeUnit value={timeLeft.minutes} label="Phút" />
              <TimeUnit value={timeLeft.seconds} label="Giây" />
            </div>
          </div>

          <button
            onClick={onScrollToVouchers}
            className="bg-coral-sale hover:bg-orange-600 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-black text-lg sm:text-xl transition-all shadow-lg"
          >
            SĂN VOUCHER NGAY
          </button>
        </div>
      </div>
    </section>
  );
};

export default PromotionBanner;
