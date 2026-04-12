import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Zap, Truck, Wallet, Banknote, Smartphone,
  Tag, ChevronRight, Leaf, ShieldCheck, Clock
} from 'lucide-react';
import SuccessModal from './SuccessModal';

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const SHIPPING_OPTIONS = [
  {
    id: 'express',
    label: 'Giao hàng hỏa tốc',
    sub: 'Nhận trong 2 giờ',
    icon: <Zap size={18} className="text-amber-500" />,
    fee: 35000,
    badge: 'Nhanh nhất',
  },
  {
    id: 'standard',
    label: 'Giao hàng tiêu chuẩn',
    sub: 'Nhận trong 1–2 ngày',
    icon: <Truck size={18} className="text-sky-500" />,
    fee: 15000,
    badge: null,
  },
];

const PAYMENT_METHODS = [
  {
    id: 'cod',
    label: 'Tiền mặt (COD)',
    sub: 'Thanh toán khi nhận hàng',
    icon: <Banknote size={22} className="text-emerald-500" />,
  },
  {
    id: 'bank',
    label: 'Chuyển khoản ngân hàng',
    sub: 'Vietcombank · Techcombank · MB',
    icon: <Wallet size={22} className="text-indigo-500" />,
  },
  {
    id: 'ewallet',
    label: 'Ví điện tử',
    sub: 'Momo · VNPAY · ZaloPay',
    icon: <Smartphone size={22} className="text-rose-500" />,
  },
];

const VALID_CODES = { FRESH20: 0.2, GARDEN10: 0.1, UIT15: 0.15 };

const pageVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, x: -60, transition: { duration: 0.3 } },
};

const Checkout = ({ cartItems = [], onBack }) => {
  const [form, setForm] = useState({ fullName: '', phone: '', address: '' });
  const [shipping, setShipping] = useState('standard');
  const [payment, setPayment] = useState('cod');
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const subtotal = cartItems.reduce((a, i) => a + i.price * i.quantity, 0);
  const shippingFee = SHIPPING_OPTIONS.find((o) => o.id === shipping)?.fee ?? 0;
  const discountAmount = appliedDiscount ? Math.round(subtotal * appliedDiscount) : 0;
  const total = subtotal + shippingFee - discountAmount;

  const handleApplyCode = () => {
    const code = discountCode.trim().toUpperCase();
    if (VALID_CODES[code] != null) {
      setAppliedDiscount(VALID_CODES[code]);
      setDiscountError('');
    } else {
      setAppliedDiscount(null);
      setDiscountError('Mã không hợp lệ hoặc đã hết hạn.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
  };

  return (
    <>
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100"
      >
        {/* ── Top bar ── */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
          <div className="container mx-auto px-4 md:px-8 py-4 flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors font-medium text-sm"
            >
              <ArrowLeft size={18} /> Quay lại giỏ hàng
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
              <Leaf size={20} className="text-emerald-500" />
              FreshGarden
            </div>
            <div className="ml-auto flex items-center gap-1.5 text-emerald-600 text-xs font-semibold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <ShieldCheck size={14} /> Thanh toán bảo mật
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2">
            Thanh Toán
          </h1>
          <p className="text-slate-500 mb-10 text-sm">
            Kiểm tra thông tin và hoàn tất đơn hàng của bạn
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">

              {/* ════ COLUMN 1: Shipping & Payment ════ */}
              <div className="space-y-6">

                {/* ── Shipping Info ── */}
                <Section title="Thông Tin Giao Hàng" icon={<MapPin size={18} className="text-emerald-500" />}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label="Họ và tên"
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
                  <div className="mt-4 relative">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                      Địa chỉ giao hàng
                    </label>
                    <div className="relative">
                      <input
                        required
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        placeholder="Số nhà, tên đường, phường, quận..."
                        className="w-full pr-36 pl-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition text-sm"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <MapPin size={12} /> Chọn trên bản đồ
                      </button>
                    </div>
                  </div>
                </Section>

                {/* ── Shipping Method ── */}
                <Section title="Phương Thức Vận Chuyển" icon={<Truck size={18} className="text-emerald-500" />}>
                  <div className="space-y-3">
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

                {/* ── Payment Method ── */}
                <Section title="Phương Thức Thanh Toán" icon={<Wallet size={18} className="text-emerald-500" />}>
                  <div className="space-y-3">
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
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/60 overflow-hidden">

                  {/* Header */}
                  <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-emerald-500 to-teal-500">
                    <h2 className="text-white font-bold text-lg">Đơn Hàng Của Bạn</h2>
                    <p className="text-emerald-100 text-xs mt-0.5">{cartItems.length} sản phẩm</p>
                  </div>

                  {/* Items */}
                  <div className="px-6 py-4 space-y-4 max-h-64 overflow-y-auto">
                    {cartItems.length === 0 ? (
                      <p className="text-slate-400 text-sm text-center py-4">Không có sản phẩm nào</p>
                    ) : (
                      cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-14 h-14 rounded-xl object-cover border border-slate-100"
                            />
                            <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-800 font-semibold text-sm line-clamp-1">{item.name}</p>
                            <p className="text-slate-400 text-xs">{item.unit}</p>
                          </div>
                          <div className="text-slate-700 font-bold text-sm shrink-0">
                            {formatVND(item.price * item.quantity)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Divider */}
                  <div className="mx-6 border-t border-dashed border-slate-200" />

                  {/* Discount Code */}
                  <div className="px-6 py-4">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Mã giảm giá
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          value={discountCode}
                          onChange={(e) => {
                            setDiscountCode(e.target.value);
                            setDiscountError('');
                            if (!e.target.value) setAppliedDiscount(null);
                          }}
                          placeholder="Nhập mã..."
                          className="w-full pl-8 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition uppercase placeholder-normal"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyCode}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors"
                      >
                        Áp dụng
                      </button>
                    </div>
                    <AnimatePresence>
                      {discountError && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-red-500 text-xs mt-1.5"
                        >
                          {discountError}
                        </motion.p>
                      )}
                      {appliedDiscount && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-emerald-600 text-xs mt-1.5 font-semibold flex items-center gap-1"
                        >
                          ✓ Áp dụng thành công — giảm {(appliedDiscount * 100).toFixed(0)}%
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Price Breakdown */}
                  <div className="px-6 pb-4 space-y-2.5 text-sm">
                    <PriceRow label="Tạm tính" value={formatVND(subtotal)} />
                    <PriceRow
                      label={`Phí vận chuyển (${shipping === 'express' ? 'Hỏa tốc' : 'Tiêu chuẩn'})`}
                      value={formatVND(shippingFee)}
                    />
                    {appliedDiscount && (
                      <PriceRow
                        label={`Giảm giá (${(appliedDiscount * 100).toFixed(0)}%)`}
                        value={`- ${formatVND(discountAmount)}`}
                        highlight
                      />
                    )}
                  </div>

                  <div className="mx-6 border-t border-slate-200" />

                  {/* Total */}
                  <div className="px-6 py-4 flex items-center justify-between">
                    <span className="text-slate-600 font-semibold">Tổng cộng</span>
                    <span className="text-2xl font-extrabold text-emerald-600">{formatVND(total)}</span>
                  </div>

                  {/* CTA */}
                  <div className="px-6 pb-6">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-emerald-400/40 transition-all flex items-center justify-center gap-2"
                    >
                      Xác Nhận Đặt Hàng <ChevronRight size={18} />
                    </motion.button>
                    <p className="text-center text-slate-400 text-xs mt-3 flex items-center justify-center gap-1">
                      <ShieldCheck size={12} /> Giao dịch được mã hoá SSL 256-bit
                    </p>
                  </div>

                  {/* Delivery estimate */}
                  <div className="mx-6 mb-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-2">
                    <Clock size={15} className="text-amber-500 shrink-0" />
                    <p className="text-amber-700 text-xs font-medium">
                      {shipping === 'express'
                        ? 'Dự kiến giao ngay hôm nay trước 18:00 '
                        : 'Dự kiến giao trong 1–2 ngày làm việc '}
                    </p>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  {[
                    { icon: '', label: 'Tươi 100%' },
                    { icon: '', label: 'Hoàn tiền 7 ngày' },
                    { icon: '', label: 'Giao nhanh 2h' },
                  ].map((b) => (
                    <div key={b.label} className="bg-white rounded-xl border border-slate-100 py-3 text-xs text-slate-500 font-medium shadow-sm">
                      <div className="text-xl mb-1">{b.icon}</div>
                      {b.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-200 mt-12 py-6">
          <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-400">
            <p>© {new Date().getFullYear()} FreshGarden. All rights reserved.</p>
            <div className="text-sm px-4 py-2 bg-slate-800/5 rounded-full border border-slate-200 font-medium font-mono text-emerald-600">
              Built by Duc Bao - Nong Lam University
            </div>
          </div>
        </footer>
      </motion.div>

      <SuccessModal isOpen={showSuccess} cartItems={cartItems} />
    </>
  );
};

/* ─── Sub-components ─── */

const Section = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
      {icon}
      <h2 className="font-bold text-slate-800">{title}</h2>
    </div>
    <div className="px-6 py-5">{children}</div>
  </div>
);

const InputField = ({ label, id, value, onChange, placeholder, type = 'text', required }) => (
  <div>
    <label htmlFor={id} className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition text-sm"
    />
  </div>
);

const ShippingCard = ({ option, selected, onSelect }) => (
  <motion.button
    type="button"
    onClick={onSelect}
    whileTap={{ scale: 0.99 }}
    className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl border-2 transition-all text-left ${
      selected
        ? 'border-emerald-400 bg-emerald-50/60 shadow-sm shadow-emerald-100'
        : 'border-slate-200 bg-white hover:border-slate-300'
    }`}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selected ? 'bg-emerald-100' : 'bg-slate-100'}`}>
      {option.icon}
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <span className="font-bold text-slate-800 text-sm">{option.label}</span>
        {option.badge && (
          <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
            {option.badge}
          </span>
        )}
      </div>
      <p className="text-slate-400 text-xs mt-0.5">{option.sub}</p>
    </div>
    <div className={`font-bold text-sm ${selected ? 'text-emerald-600' : 'text-slate-500'}`}>
      {formatVND(option.fee)}
    </div>
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selected ? 'border-emerald-500' : 'border-slate-300'}`}>
      {selected && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
    </div>
  </motion.button>
);

const PaymentCard = ({ method, selected, onSelect }) => (
  <motion.button
    type="button"
    onClick={onSelect}
    whileTap={{ scale: 0.99 }}
    className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl border-2 transition-all text-left ${
      selected
        ? 'border-emerald-400 bg-emerald-50/60 shadow-sm shadow-emerald-100'
        : 'border-slate-200 bg-white hover:border-slate-300'
    }`}
  >
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${selected ? 'bg-emerald-50' : 'bg-slate-50'}`}>
      {method.icon}
    </div>
    <div className="flex-1">
      <p className="font-bold text-slate-800 text-sm">{method.label}</p>
      <p className="text-slate-400 text-xs mt-0.5">{method.sub}</p>
    </div>
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selected ? 'border-emerald-500' : 'border-slate-300'}`}>
      {selected && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
    </div>
  </motion.button>
);

const PriceRow = ({ label, value, highlight }) => (
  <div className="flex items-center justify-between">
    <span className={highlight ? 'text-emerald-600 font-semibold' : 'text-slate-500'}>{label}</span>
    <span className={highlight ? 'text-emerald-600 font-bold' : 'text-slate-700 font-semibold'}>{value}</span>
  </div>
);

export default Checkout;
