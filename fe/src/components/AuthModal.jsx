import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User as UserIcon } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLoginView ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await fetch('http://localhost:8082' + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(data.message);
        if (isLoginView || !isLoginView) { // Both login and successful registration can sign in
           onLogin(data.user);
           onClose();
        }
      } else {
        alert(data.message || 'Đã có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Không thể kết nối tới server!');
    }
  };

  const handleToggle = () => {
    setIsLoginView(!isLoginView);
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden p-8"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors z-10"
            >
              <X size={18} />
            </button>

            <div className="mb-8 text-center relative z-0">
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
                {isLoginView ? 'Đăng Nhập' : 'Mở Tài Khoản'}
              </h2>
              <p className="text-slate-500 mt-2 text-sm">
                {isLoginView ? 'Mừng bạn trở lại với FreshGarden!' : 'Đồng hành cùng lối sống xanh khoẻ mạnh.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              <AnimatePresence mode="popLayout">
                {!isLoginView && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative"
                  >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <UserIcon size={18} />
                    </div>
                    <input
                      type="text"
                      placeholder="Họ Tên Của Bạn"
                      required={!isLoginView}
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-slate-700 bg-slate-50 focus:bg-white"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="Địa chỉ Email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-slate-700 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-slate-700 bg-slate-50 focus:bg-white"
                />
              </div>

              {isLoginView && (
                <div className="text-right">
                  <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">Quên mật khẩu?</a>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 mt-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-md active:scale-[0.98]"
              >
                {isLoginView ? 'Đăng Nhập' : 'Đăng Ký Ngay'}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500 border-t border-slate-100 pt-6">
              {isLoginView ? 'Chưa có tài khoản? ' : 'Đã có tài khoản! '}
              <button
                onClick={handleToggle}
                className="font-bold text-brand-600 hover:text-brand-700 transition-colors outline-none"
              >
                {isLoginView ? 'Đăng ký' : 'Đăng nhập'}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
