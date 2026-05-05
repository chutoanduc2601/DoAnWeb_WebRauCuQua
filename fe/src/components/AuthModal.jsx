import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const [viewMode, setViewMode] = useState('login'); // 'login', 'register', 'forgot_password'
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { signIn, signUp, resetPassword } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (viewMode === 'login') {
        await signIn(formData.email, formData.password);
        onClose();
      } else if (viewMode === 'register') {
        const data = await signUp(formData.email, formData.password, formData.name);

        if (data.user && !data.session) {
          setSuccessMessage('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.');
        } else {
          onClose();
        }
      } else if (viewMode === 'forgot_password') {
        await resetPassword(formData.email);
        setSuccessMessage('Đường dẫn khôi phục mật khẩu đã được gửi đến email của bạn.');
      }
    } catch (err) {
      console.error('Auth error:', err);
      if (err.message.includes('Invalid login credentials')) {
        setError('Sai email hoặc mật khẩu');
      } else if (err.message.includes('User already registered')) {
        setError('Email đã được sử dụng');
      } else if (err.message.includes('Password should be at least')) {
        setError('Mật khẩu phải có ít nhất 6 ký tự');
      } else if (err.message.includes('Unable to validate email')) {
        setError('Email không hợp lệ');
      } else {
        setError(err.message || 'Đã có lỗi xảy ra');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setViewMode(viewMode === 'login' ? 'register' : 'login');
    setFormData({ name: '', email: '', password: '' });
    setError('');
    setSuccessMessage('');
  };

  const switchToForgot = (e) => {
    e.preventDefault();
    setViewMode('forgot_password');
    setError('');
    setSuccessMessage('');
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
                {viewMode === 'login' && 'Đăng Nhập'}
                {viewMode === 'register' && 'Mở Tài Khoản'}
                {viewMode === 'forgot_password' && 'Quên Mật Khẩu'}
              </h2>
              <p className="text-slate-500 mt-2 text-sm">
                {viewMode === 'login' && 'Mừng bạn trở lại với Farmily!'}
                {viewMode === 'register' && 'Đồng hành cùng lối sống xanh khoẻ mạnh.'}
                {viewMode === 'forgot_password' && 'Nhập email để nhận liên kết khôi phục.'}
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm text-center"
              >
                {successMessage}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              <AnimatePresence mode="popLayout">
                {viewMode === 'register' && (
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
                      required={viewMode === 'register'}
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

              <AnimatePresence mode="popLayout">
                {viewMode !== 'forgot_password' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative"
                  >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      placeholder="Mật khẩu"
                      required={viewMode !== 'forgot_password'}
                      minLength={6}
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-slate-700 bg-slate-50 focus:bg-white"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {viewMode === 'login' && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={switchToForgot}
                    className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                {viewMode === 'login' && 'Đăng Nhập'}
                {viewMode === 'register' && 'Đăng Ký Ngay'}
                {viewMode === 'forgot_password' && 'Gửi Liên Kết Khôi Phục'}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500 border-t border-slate-100 pt-6">
              {viewMode === 'forgot_password' ? (
                <button
                  onClick={() => { setViewMode('login'); setError(''); setSuccessMessage(''); }}
                  className="font-bold text-brand-600 hover:text-brand-700 transition-colors outline-none"
                >
                  Quay lại đăng nhập
                </button>
              ) : (
                <>
                  {viewMode === 'login' ? 'Chưa có tài khoản? ' : 'Đã có tài khoản! '}
                  <button
                    onClick={handleToggle}
                    className="font-bold text-brand-600 hover:text-brand-700 transition-colors outline-none"
                  >
                    {viewMode === 'login' ? 'Đăng ký' : 'Đăng nhập'}
                  </button>
                </>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
