import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Zap, Truck, Wallet, Banknote, Smartphone,
  Tag, ChevronRight, Leaf, ShieldCheck, Clock, Loader2, Sparkles, RotateCcw
} from 'lucide-react';
import SuccessModal from './SuccessModal';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const SHIPPING_OPTIONS = [
  {
    id: 'express',
    label: 'Giao hàng hỏa tốc',
    sub: 'Nhận trong 2 giờ',
    icon: <Zap size={18} />,
    fee: 35000,
    badge: 'Nhanh nhất',
  },
  {
    id: 'standard',
    label: 'Giao hàng tiêu chuẩn',
    sub: 'Nhận trong 1–2 ngày',
    icon: <Truck size={18} />,
    fee: 15000,
    badge: null,
  },
];

const PAYMENT_METHODS = [
  {
    id: 'cod',
    label: 'Tiền mặt (COD)',
    sub: 'Thanh toán khi nhận hàng',
    icon: <Banknote size={22} />,
  },
  {
    id: 'bank',
    label: 'Chuyển khoản ngân hàng',
    sub: 'Vietcombank · Techcombank · MB',
    icon: <Wallet size={22} />,
  },
  {
    id: 'ewallet',
    label: 'Ví điện tử',
    sub: 'Momo · VNPAY · ZaloPay',
    icon: <Smartphone size={22} />,
  },
];

const pageVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.25 } },
};

const Checkout = ({ cartItems = [], onBack, onSuccess }) => {
  const { user, profile } = useAuth();
  const [form, setForm] = useState({ fullName: '', phone: '', address: '' });
  const [shipping, setShipping] = useState('standard');
  const [payment, setPayment] = useState('cod');
  const [discountCode, setDiscountCode] = useState('');
  const [appliedPromotion, setAppliedPromotion] = useState(null);
  const [discountError, setDiscountError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pre-fill form from profile
  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || ''
      });
    }
  }, [profile]);

  const subtotal = cartItems.reduce((a, i) => a + i.price * i.quantity, 0);
  const shippingFee = SHIPPING_OPTIONS.find((o) => o.id === shipping)?.fee ?? 0;
  
  const discountAmount = useMemo(() => {
    if (!appliedPromotion) return 0;
    if (appliedPromotion.type === 'PERCENT') {
      return Math.round(subtotal * (appliedPromotion.value / 100));
    } else {
      return appliedPromotion.value;
    }
  }, [appliedPromotion, subtotal]);

  const total = subtotal + shippingFee - discountAmount;

  const handleApplyCode = async () => {
    const code = discountCode.trim().toUpperCase();
    if (!code) return;

    setIsValidating(true);
    setDiscountError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/promotions/validate?code=${code}&amount=${subtotal}`);
      const result = await response.json();

      if (response.ok) {
        setAppliedPromotion(result);
        setDiscountError('');
      } else {
        setAppliedPromotion(null);
        setDiscountError(result.message || 'Mã không hợp lệ hoặc đã hết hạn.');
      }
    } catch (err) {
      setAppliedPromotion(null);
      setDiscountError('Lỗi kết nối máy chủ.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (cartItems.length === 0) {
      setError('Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(form.phone.replace(/\s/g, ''))) {
      setError('Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 chữ số.');
      return;
    }

    setLoading(true);
    setError(null);

    const orderData = {
      fullName: form.fullName,
      phone: form.phone,
      address: form.address,
      userId: user?.id,
      shippingMethod: shipping,
      paymentMethod: payment,
      subtotal,
      shippingFee,
      discountAmount,
      total,
      promotionCode: appliedPromotion?.code || null,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        unit: item.unit
      }))
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to place order. Please try again.');
      }

      const result = await response.json();
      
      const localOrderData = {
        id: result.orderCode || result.id || Math.random().toString(),
        items: cartItems,
        isMine: true
      };
      window.dispatchEvent(new CustomEvent('local-new-order', { detail: localOrderData }));

      setOrderResult(result);
      setShowSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="min-h-screen bg-gradient-to-tr from-[#ECFDF5] via-[#F9FAFB] to-[#EEF2F6] pb-24 font-sans text-slate-700 antialiased"
      >
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-emerald-100/50 shadow-sm shadow-emerald-900/5">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={onBack}
              className="group flex items-center gap-2 text-slate-600 hover:text-emerald-700 transition-colors font-bold text-sm bg-slate-100/80 hover:bg-emerald-50 px-4 py-2 rounded-xl border border-slate-200/50 hover:border-emerald-100"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> 
              Quay lại giỏ hàng
            </button>
            
            <div className="hidden sm:flex items-center gap-2 text-emerald-800 font-black text-xl tracking-tight">
              <Leaf size={22} className="text-emerald-500 fill-emerald-100" />
              Farmily
            </div>
            
            <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold bg-emerald-50 border border-emerald-100 px-3.5 py-2 rounded-xl shadow-sm">
              <ShieldCheck size={14} className="text-emerald-600 animate-pulse" /> 
              Thanh toán an toàn SSL
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-10 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 bg-clip-text text-transparent">
              Thực Hiện Thanh Toán
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm font-semibold">
              Kiểm tra thông tin giao nhận và hoàn tất đơn hàng xanh của bạn
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_390px] xl:grid-cols-[1fr_430px] gap-8">

              {/* ════ COLUMN 1: Shipping & Payment ════ */}
              <div className="space-y-6">

                {/* Shipping Info */}
                <Section title="Thông Tin Giao Hàng" icon={<MapPin size={18} />}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label="Họ và tên người nhận"
                      id="fullName"
                      value={form.fullName}
                      onChange={(v) => setForm({ ...form, fullName: v })}
                      placeholder="Nguyễn Văn A"
                      required
                    />
                    <InputField
                      label="Số điện thoại"
                      id="phone"
                      value={form.phone}
                      onChange={(v) => setForm({ ...form, phone: v })}
                      placeholder="0912 345 678"
                      type="tel"
                      required
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                      Địa chỉ nhận hàng chi tiết
                    </label>
                    <div className="relative flex flex-col sm:flex-row gap-2">
                      <input
                        required
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        placeholder="Số nhà, tên đường, phường, quận..."
                        className="w-full pl-4 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm shadow-sm font-medium"
                      />
                      <button
                        type="button"
                        className="flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/50 hover:border-emerald-200 px-4 py-3 rounded-xl transition-all shadow-sm shrink-0 justify-center"
                      >
                        <MapPin size={13} /> Định vị GPS
                      </button>
                    </div>
                  </div>
                </Section>

                {/* Shipping Method */}
                <Section title="Phương Thức Vận Chuyển" icon={<Truck size={18} />}>
                  <div className="space-y-3.5">
                    {SHIPPING_OPTIONS.map((opt) => (
                      <ShippingCard
                        key={opt.id}
                        option={opt}
                        selected={shipping === opt.id}
                        onSelect={() => setShipping(opt.id)}
                      />
                    ))}
                  </div>
                </Section>

                {/* Payment Method */}
                <Section title="Phương Thức Thanh Toán" icon={<Wallet size={18} />}>
                  <div className="space-y-3.5">
                    {PAYMENT_METHODS.map((pm) => (
                      <PaymentCard
                        key={pm.id}
                        method={pm}
                        selected={payment === pm.id}
                        onSelect={() => setPayment(pm.id)}
                      />
                    ))}
                  </div>
                </Section>
              </div>

              {/* ════ COLUMN 2: Order Summary ════ */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">

                  {/* Summary Card Header */}
                  <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                    <h2 className="font-extrabold text-base sm:text-lg tracking-tight">Đơn Hàng Của Bạn</h2>
                    <p className="text-emerald-100 text-xs font-semibold mt-1">Sẵn sàng vận chuyển {cartItems.length} thực phẩm sạch</p>
                  </div>

                  {/* Items List */}
                  <div className="px-6 py-4 space-y-4 max-h-56 sm:max-h-64 overflow-y-auto border-b border-slate-50 no-scrollbar">
                    {cartItems.length === 0 ? (
                      <p className="text-slate-400 text-sm text-center py-6 font-semibold">Giỏ hàng rỗng</p>
                    ) : (
                      cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 py-1">
                          <div className="relative shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-slate-100/80 bg-slate-50 shadow-sm"
                            />
                            <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[9px] font-black w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-800 font-extrabold text-xs sm:text-sm line-clamp-1 leading-snug">{item.name}</p>
                            <p className="text-slate-400 text-[10px] sm:text-xs font-semibold mt-0.5">{item.unit}</p>
                          </div>
                          <div className="text-slate-800 font-black text-xs sm:text-sm shrink-0 pl-1">
                            {formatVND(item.price * item.quantity)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Discount Code Section */}
                  <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-50">
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                      Nhập mã giảm giá
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          value={discountCode}
                          onChange={(e) => {
                            setDiscountCode(e.target.value);
                            setDiscountError('');
                            if (!e.target.value) setAppliedPromotion(null);
                          }}
                          placeholder="FARMILY50K..."
                          className="w-full pl-8.5 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition uppercase font-bold placeholder:font-medium text-slate-800"
                        />
                      </div>
                      <button
                        type="button"
                        disabled={isValidating}
                        onClick={handleApplyCode}
                        className="flex items-center justify-center min-w-[85px] px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl transition-all shadow-sm disabled:opacity-70 whitespace-nowrap"
                      >
                        {isValidating ? <Loader2 size={14} className="animate-spin" /> : 'Áp dụng'}
                      </button>
                    </div>
                    <AnimatePresence>
                      {discountError && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-rose-500 text-xs mt-2 font-bold flex items-center gap-1"
                        >
                          ⚠️ {discountError}
                        </motion.p>
                      )}
                      {appliedPromotion && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-emerald-700 text-xs mt-2 font-black flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100/50 shadow-sm"
                        >
                          ✓ Đã áp dụng: Giảm {appliedPromotion.type === 'PERCENT' ? `${appliedPromotion.value}%` : formatVND(appliedPromotion.value)}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Price Breakdown */}
                  <div className="px-6 py-4 space-y-3 text-xs sm:text-sm border-b border-slate-50 font-semibold text-slate-500">
                    <PriceRow label="Tiền hàng tạm tính" value={formatVND(subtotal)} />
                    <PriceRow
                      label={`Phí vận chuyển (${shipping === 'express' ? 'Hỏa tốc' : 'Tiêu chuẩn'})`}
                      value={formatVND(shippingFee)}
                    />
                    {appliedPromotion && (
                      <PriceRow
                        label={`Khuyến mãi (${appliedPromotion.code})`}
                        value={`- ${formatVND(discountAmount)}`}
                        highlight
                      />
                    )}
                  </div>

                  {/* Total Cost */}
                  <div className="px-6 py-4 flex items-center justify-between bg-slate-50/20">
                    <span className="text-slate-800 font-extrabold text-sm sm:text-base">Tổng thanh toán</span>
                    <span className="text-xl sm:text-2xl font-black text-emerald-700">{formatVND(total)}</span>
                  </div>

                  {/* CTA Action */}
                  <div className="px-6 pb-6 pt-3">
                    <motion.button
                      type="submit"
                      disabled={loading || cartItems.length === 0}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-3.5 sm:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-emerald-600/15 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Đang khởi tạo đơn hàng...
                        </>
                      ) : (
                        <>
                          Xác Nhận Đặt Hàng <ChevronRight size={16} />
                        </>
                      )}
                    </motion.button>
                    {error && (
                      <p className="text-rose-600 text-xs mt-3 text-center font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                        ⚠️ {error}
                      </p>
                    )}
                    <p className="text-center text-slate-400 text-[10px] sm:text-xs mt-3.5 flex items-center justify-center gap-1 font-semibold">
                      <ShieldCheck size={12} className="text-emerald-500 animate-pulse" /> Mã hóa bảo mật SSL 256-bit an toàn tuyệt đối
                    </p>
                  </div>

                  {/* Delivery Estimate Notification */}
                  <div className="mx-6 mb-6 bg-amber-50/80 border border-amber-100 rounded-2xl px-4 py-3 flex items-center gap-2.5">
                    <Clock size={15} className="text-amber-600 shrink-0 animate-pulse" />
                    <p className="text-amber-800 text-[10px] sm:text-xs font-bold leading-normal">
                      {shipping === 'express'
                        ? 'Dự kiến giao hàng hỏa tốc trong 2 giờ tới.'
                        : 'Dự kiến giao hàng từ 1–2 ngày làm việc.'}
                    </p>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  {[
                    { icon: <Sparkles size={16} />, label: 'Tươi sạch 100%' },
                    { icon: <ShieldCheck size={16} />, label: 'Bồi hoàn 7 ngày' },
                    { icon: <Truck size={16} />, label: 'Giao nhanh 2h' },
                  ].map((badge, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-slate-100 py-3 px-1 text-[10px] sm:text-xs text-slate-500 font-bold shadow-sm flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                        {badge.icon}
                      </div>
                      <span className="leading-tight">{badge.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-200/60 mt-12 py-6">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-400">
            <p>© {new Date().getFullYear()} Farmily. Tất cả quyền được bảo lưu.</p>
            <div className="text-xs px-4 py-2 bg-slate-800/5 rounded-full border border-slate-200/50 font-bold font-mono text-emerald-700">
              Built by Duc Bao - Nong Lam University
            </div>
          </div>
        </footer>
      </motion.div>

      <SuccessModal 
        isOpen={showSuccess} 
        cartItems={cartItems} 
        orderCode={orderResult?.orderCode} 
        onContinue={() => {
          if (onSuccess) onSuccess('continue');
        }}
        onTrack={() => {
          if (onSuccess) onSuccess('track');
        }}
      />
    </>
  );
};

/* ─── Sub-components ─── */

const Section = ({ title, icon, children }) => (
  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="px-5 sm:px-6 py-4 border-b border-slate-100/60 bg-slate-50/40 flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
        {icon}
      </div>
      <h2 className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight">{title}</h2>
    </div>
    <div className="px-5 sm:px-6 py-5 sm:py-6">{children}</div>
  </div>
);

const InputField = ({ label, id, value, onChange, placeholder, type = 'text', required }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider">
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(v) => onChange(v)}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm shadow-sm font-medium"
    />
  </div>
);

const ShippingCard = ({ option, selected, onSelect }) => (
  <motion.button
    type="button"
    onClick={onSelect}
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    className={`w-full flex items-center gap-3 sm:gap-4 px-4 py-4 rounded-2xl border-2 transition-all text-left ${
      selected
        ? 'border-emerald-500 bg-emerald-50/40 shadow-md shadow-emerald-100/50'
        : 'border-slate-100 bg-white hover:border-emerald-100 hover:bg-emerald-500/[0.01]'
    }`}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
      selected ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'bg-slate-50 text-slate-400'
    }`}>
      {option.icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-extrabold text-slate-800 text-xs sm:text-sm">{option.label}</span>
        {option.badge && (
          <span className="text-[9px] font-extrabold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md border border-amber-200/50">
            {option.badge}
          </span>
        )}
      </div>
      <p className="text-slate-400 text-[10px] sm:text-xs mt-1 font-semibold">{option.sub}</p>
    </div>
    <div className={`font-black text-xs sm:text-sm shrink-0 mr-2 ${selected ? 'text-emerald-700' : 'text-slate-500'}`}>
      {formatVND(option.fee)}
    </div>
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
      selected ? 'border-emerald-600 bg-emerald-600 shadow-sm' : 'border-slate-200'
    }`}>
      {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
    </div>
  </motion.button>
);

const PaymentCard = ({ method, selected, onSelect }) => (
  <motion.button
    type="button"
    onClick={onSelect}
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    className={`w-full flex items-center gap-3 sm:gap-4 px-4 py-4 rounded-2xl border-2 transition-all text-left ${
      selected
        ? 'border-emerald-500 bg-emerald-50/40 shadow-md shadow-emerald-100/50'
        : 'border-slate-100 bg-white hover:border-emerald-100 hover:bg-emerald-500/[0.01]'
    }`}
  >
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
      selected ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'bg-slate-50 text-slate-400'
    }`}>
      {method.icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-extrabold text-slate-800 text-xs sm:text-sm">{method.label}</p>
      <p className="text-slate-400 text-[10px] sm:text-xs mt-1 font-semibold">{method.sub}</p>
    </div>
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
      selected ? 'border-emerald-600 bg-emerald-600 shadow-sm' : 'border-slate-200'
    }`}>
      {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
    </div>
  </motion.button>
);

const PriceRow = ({ label, value, highlight }) => (
  <div className="flex items-center justify-between">
    <span className={highlight ? 'text-emerald-700 font-extrabold' : 'text-slate-500 font-semibold'}>{label}</span>
    <span className={highlight ? 'text-emerald-700 font-black' : 'text-slate-700 font-bold'}>{value}</span>
  </div>
);

export default Checkout;
