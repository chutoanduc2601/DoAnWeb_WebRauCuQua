import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, MapPin, Save, Loader2, CheckCircle2, ShieldCheck, Mail, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const { profile, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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
      setMessage({ type: 'success', text: 'Thông tin của bạn đã được cập nhật an toàn!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    } catch (error) {
      console.error('Update error:', error);
      setMessage({ type: 'error', text: 'Không thể cập nhật. Vui lòng kiểm tra lại kết nối.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-100/30 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl shadow-emerald-900/5 overflow-hidden border border-white/80"
        >
          {/* Header Profile */}
          <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-8 sm:p-10 text-white relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
            
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-24 h-24 sm:w-28 sm:h-28 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl relative"
              >
                <User size={48} className="text-white" />
                <div className="absolute -bottom-2 -right-2 bg-emerald-400 border-4 border-white rounded-full p-1.5 shadow-lg">
                  <ShieldCheck size={16} className="text-white" />
                </div>
              </motion.div>
              
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Tài Khoản Của Tôi</h1>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-emerald-50 text-sm font-medium">
                  <div className="flex items-center gap-1.5">
                    <Mail size={14} className="opacity-70" /> {profile?.email}
                  </div>
                
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <AnimatePresence mode="wait">
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`mb-8 p-4 rounded-2xl flex items-center gap-3 border ${
                    message.type === 'success' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-red-50 text-red-700 border-red-100'
                  }`}
                >
                  {message.type === 'success' ? <CheckCircle2 size={20} /> : <User size={20} />}
                  <span className="font-bold text-sm">{message.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGroup
                  label="Họ và Tên"
                  icon={<User size={18} />}
                  id="name"
                  value={formData.name}
                  onChange={(v) => setFormData({ ...formData, name: v })}
                  placeholder="Nhập tên của bạn..."
                  required
                />

                <InputGroup
                  label="Số Điện Thoại"
                  icon={<Phone size={18} />}
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(v) => setFormData({ ...formData, phone: v })}
                  placeholder="Số điện thoại của bạn..."
                />
              </div>

              <div className="space-y-2.5">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2 uppercase tracking-wider">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <MapPin size={18} />
                  </div>
                  Địa Chỉ Nhận Hàng
                </label>
                <textarea
                  rows="4"
                  placeholder="Số nhà, tên đường, phường, quận, thành phố..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all bg-white text-slate-800 placeholder-slate-400 font-medium resize-none shadow-inner"
                />
              </div>

              <div className="pt-4">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-4.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-extrabold text-lg transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <>
                      <Loader2 size={22} className="animate-spin" />
                      Đang đồng bộ dữ liệu...
                    </>
                  ) : (
                    <>
                      <Save size={22} className="group-hover:scale-110 transition-transform" />
                      Lưu Thông Tin Cập Nhật
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>

          <div className="px-8 py-6 bg-slate-50/50 backdrop-blur-md border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-bold uppercase tracking-widest">
             <div className="flex items-center gap-2.5">
               <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-400" />
               Trạng thái: Đã xác thực
             </div>
             <div className="bg-white px-3 py-1.5 rounded-full border border-slate-200 text-slate-500">
               UID: {profile?.id?.slice(0, 12)}...
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, icon, id, value, onChange, placeholder, type = 'text', required }) => (
  <div className="space-y-2.5">
    <label htmlFor={id} className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2 uppercase tracking-wider">
      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
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
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all bg-white text-slate-800 placeholder-slate-400 font-medium shadow-inner"
    />
  </div>
);

export default UserProfile;
