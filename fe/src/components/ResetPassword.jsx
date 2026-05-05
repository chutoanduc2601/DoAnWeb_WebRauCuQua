import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Loader2, Leaf, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  // Supabase auth handles the parsing of the hash fragment from the email link automatically
  // and establishes a session. So we just need to let the user update their password.

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      return setError('Mật khẩu phải có ít nhất 6 ký tự.');
    }

    if (password !== confirmPassword) {
      return setError('Mật khẩu xác nhận không khớp.');
    }

    setLoading(true);

    try {
      await updatePassword(password);
      setSuccess(true);
    } catch (err) {
      console.error('Lỗi khi cập nhật mật khẩu:', err);
      setError(err.message || 'Có lỗi xảy ra khi cập nhật mật khẩu. Link có thể đã hết hạn.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Mật khẩu đã được thay đổi!</h2>
          <p className="text-slate-600 mb-8">
            Bạn đã cập nhật mật khẩu thành công. Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.
          </p>
          <Link
            to="/"
            className="w-full inline-flex items-center justify-center gap-2 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-colors"
          >
            Quay lại trang chủ
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      
      <Link to="/" className="flex items-center gap-2 text-brand-600 mb-8 hover:scale-105 transition-transform">
        <Leaf size={32} />
        <span className="font-bold text-2xl tracking-tight">Farmily</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8"
      >
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Đặt lại mật khẩu
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock size={18} />
            </div>
            <input
              type="password"
              placeholder="Mật khẩu mới"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-slate-700 bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock size={18} />
            </div>
            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              required
              minLength={6}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-slate-700 bg-slate-50 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Lưu Mật Khẩu'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
