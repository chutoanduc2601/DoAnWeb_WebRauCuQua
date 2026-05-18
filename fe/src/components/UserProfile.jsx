import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Phone, MapPin, Save, Loader2, CheckCircle2, ShieldCheck,
  Mail, Star, Package, Heart, Award, Leaf, TrendingUp, Gift,
  Edit3, Camera, BadgeCheck, Zap, Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const StatCard = ({ icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className={`bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm border border-slate-100 hover:shadow-md transition-shadow`}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <p className="text-lg font-bold text-slate-800">{value}</p>
    </div>
  </motion.div>
);

const BadgeItem = ({ icon, label, desc, color, earned }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
    earned
      ? 'bg-white border-slate-100 shadow-sm'
      : 'bg-slate-50/50 border-dashed border-slate-200 opacity-50'
  }`}>
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${earned ? color : 'bg-slate-100'}`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className={`text-sm font-bold truncate ${earned ? 'text-slate-800' : 'text-slate-400'}`}>{label}</p>
      <p className="text-xs text-slate-400 truncate">{desc}</p>
    </div>
    {earned && <BadgeCheck size={16} className="text-emerald-500 flex-shrink-0" />}
  </div>
);

const UserProfile = ({ onBack }) => {
  const { profile, updateProfile } = useAuth();
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || ''
      });
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await updateProfile(formData);
      setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
      setEditMode(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Không thể cập nhật. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  const initials = (formData.name || profile?.email || 'U')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const memberSince = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-500 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-teal-400/20 rounded-full blur-2xl translate-y-1/2" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')] opacity-5" />

        <div className="relative container mx-auto px-4 sm:px-6 md:px-8 pt-28 pb-20">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 150, damping: 15 }}
              className="relative"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/20 backdrop-blur-md border-4 border-white/40 flex items-center justify-center shadow-2xl">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">{initials}</span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-400 border-3 border-white rounded-xl flex items-center justify-center shadow-lg">
                <ShieldCheck size={16} className="text-white" />
              </div>
            </motion.div>

            {/* Name & Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="text-center sm:text-left flex-1"
            >
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="inline-flex items-center gap-1 bg-emerald-500/30 text-emerald-100 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-400/30">
                  <Star size={11} className="fill-current" /> Thành viên VIP
                </span>
                <span className="inline-flex items-center gap-1 bg-white/15 text-white/80 text-xs font-bold px-2.5 py-1 rounded-full">
                  <Leaf size={11} /> Yêu môi trường
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
                {formData.name || 'Chào mừng bạn!'}
              </h1>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-emerald-100/80 text-sm">
                <span className="flex items-center gap-1.5">
                  <Mail size={13} /> {profile?.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} /> Thành viên từ {memberSince}
                </span>
              </div>
            </motion.div>

            {/* Edit toggle */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              onClick={() => setEditMode(!editMode)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all border border-white/20"
            >
              <Edit3 size={15} />
              {editMode ? 'Hủy chỉnh sửa' : 'Chỉnh sửa hồ sơ'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              icon={<Package size={18} className="text-blue-600" />}
              label="Đơn hàng" value="12"
              color="bg-blue-50" delay={0.1}
            />
            <StatCard
              icon={<Heart size={18} className="text-rose-500" />}
              label="Yêu thích" value="8"
              color="bg-rose-50" delay={0.15}
            />
            <StatCard
              icon={<Star size={18} className="text-amber-500" />}
              label="Đánh giá" value="5 ★"
              color="bg-amber-50" delay={0.2}
            />
            <StatCard
              icon={<TrendingUp size={18} className="text-emerald-600" />}
              label="Tiết kiệm" value="120K"
              color="bg-emerald-50" delay={0.25}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT — Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Info Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <User size={16} className="text-emerald-600" />
                  Thông tin tóm tắt
                </h3>
              </div>
              <div className="p-5 space-y-3.5">
                <InfoRow icon={<Mail size={15} />} label="Email" value={profile?.email} />
                <InfoRow icon={<Phone size={15} />} label="Điện thoại" value={formData.phone || 'Chưa cập nhật'} />
                <InfoRow icon={<MapPin size={15} />} label="Địa chỉ" value={formData.address || 'Chưa cập nhật'} />
                <InfoRow icon={<ShieldCheck size={15} />} label="Trạng thái" value="Đã xác thực" isGreen />
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Award size={16} className="text-amber-500" />
                  Huy hiệu thành tích
                </h3>
              </div>
              <div className="p-4 space-y-2.5">
                <BadgeItem
                  icon={<Leaf size={16} className="text-white" />}
                  label="Người yêu xanh"
                  desc="Đã mua 5+ sản phẩm organic"
                  color="bg-emerald-500"
                  earned={true}
                />
                <BadgeItem
                  icon={<Star size={16} className="text-white" />}
                  label="Khách hàng VIP"
                  desc="Tổng chi tiêu trên 500K"
                  color="bg-amber-500"
                  earned={true}
                />
                <BadgeItem
                  icon={<Zap size={16} className="text-white" />}
                  label="Siêu tốc"
                  desc="Thanh toán trong 30 giây"
                  color="bg-purple-500"
                  earned={false}
                />
                <BadgeItem
                  icon={<Gift size={16} className="text-white" />}
                  label="Ưu đãi hunter"
                  desc="Dùng 3 mã khuyến mãi"
                  color="bg-pink-500"
                  earned={false}
                />
              </div>
            </motion.div>
          </div>

          {/* RIGHT — Edit Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-800 text-lg">Thông tin cá nhân</h2>
                  <p className="text-slate-500 text-sm mt-0.5">
                    {editMode ? 'Cập nhật thông tin tài khoản của bạn' : 'Xem thông tin tài khoản của bạn'}
                  </p>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${editMode ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  {message.text && (
                    <motion.div
                      initial={{ opacity: 0, y: -12, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      className={`mb-6 p-4 rounded-xl flex items-center gap-3 border ${
                        message.type === 'success'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-red-50 text-red-700 border-red-100'
                      }`}
                    >
                      <CheckCircle2 size={18} />
                      <span className="font-semibold text-sm">{message.text}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <InputGroup
                      label="Họ và Tên"
                      icon={<User size={16} />}
                      id="name"
                      value={formData.name}
                      onChange={(v) => setFormData({ ...formData, name: v })}
                      placeholder="Nhập tên đầy đủ..."
                      required
                      disabled={!editMode}
                    />
                    <InputGroup
                      label="Số Điện Thoại"
                      icon={<Phone size={16} />}
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(v) => setFormData({ ...formData, phone: v })}
                      placeholder="0xxx xxx xxx"
                      disabled={!editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <MapPin size={14} />
                      </div>
                      Địa Chỉ Nhận Hàng
                    </label>
                    <textarea
                      id="address"
                      rows="3"
                      placeholder="Số nhà, tên đường, phường, quận, thành phố..."
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      disabled={!editMode}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all bg-white text-slate-800 placeholder-slate-400 text-sm resize-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Read-only email */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center text-blue-600">
                        <Mail size={14} />
                      </div>
                      Email <span className="text-xs text-slate-400 font-normal ml-1">(không thể thay đổi)</span>
                    </label>
                    <input
                      type="email"
                      value={profile?.email || ''}
                      disabled
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
                    />
                  </div>

                  {editMode && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 pt-2"
                    >
                      <button
                        type="button"
                        onClick={() => { setEditMode(false); setMessage({ type: '', text: '' }); }}
                        className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-all"
                      >
                        Hủy bỏ
                      </button>
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {loading ? (
                          <><Loader2 size={17} className="animate-spin" /> Đang lưu...</>
                        ) : (
                          <><Save size={17} /> Lưu thay đổi</>
                        )}
                      </motion.button>
                    </motion.div>
                  )}
                </form>
              </div>
            </div>

            {/* Tips Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl p-6 text-white relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')] opacity-10" />
              <div className="relative z-10 flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Gift size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Mẹo & Ưu đãi dành cho bạn</h3>
                  <p className="text-emerald-100 text-sm leading-relaxed">
                    Cập nhật đầy đủ thông tin để nhận <span className="font-bold text-white">ưu đãi độc quyền</span> và
                    giao hàng nhanh hơn. Thành viên đã cập nhật hồ sơ được hưởng <span className="font-bold text-white">giảm 5%</span> trên mỗi đơn hàng tiếp theo!
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value, isGreen }) => (
  <div className="flex items-start gap-3">
    <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0 mt-0.5">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-slate-400 font-medium">{label}</p>
      <p className={`text-sm font-semibold truncate ${isGreen ? 'text-emerald-600' : 'text-slate-700'}`}>
        {value || '—'}
        {isGreen && <span className="ml-1.5 inline-flex items-center"><CheckCircle2 size={12} className="inline" /></span>}
      </p>
    </div>
  </div>
);

const InputGroup = ({ label, icon, id, value, onChange, placeholder, type = 'text', required, disabled }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-sm font-semibold text-slate-700 flex items-center gap-2">
      <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600">
        {icon}
      </div>
      {label}
    </label>
    <input
      id={id}
      type={type}
      required={required}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all bg-white text-slate-800 placeholder-slate-400 text-sm disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
    />
  </div>
);

export default UserProfile;
