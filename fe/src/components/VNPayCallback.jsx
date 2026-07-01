import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, ShoppingBag, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '../config';

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const VNPayCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'failed' | 'error'
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const queryParams = searchParams.toString();
        const response = await fetch(`${API_BASE_URL}/api/payment/vnpay-callback?${queryParams}`);
        const result = await response.json();

        if (response.ok && result.status === 'success') {
          setStatus('success');
          setData(result);
        } else if (result.status === 'failed') {
          setStatus('failed');
          setData(result);
        } else {
          setStatus('error');
          setErrorMessage(result.message || 'Xác thực thanh toán không thành công.');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setStatus('error');
        setErrorMessage('Lỗi kết nối máy chủ. Vui lòng kiểm tra lại đơn hàng trong Lịch sử.');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-[#ECFDF5] via-[#F9FAFB] to-[#EEF2F6] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md border border-slate-200/50 p-8 rounded-3xl shadow-xl flex flex-col items-center max-w-sm w-full text-center"
        >
          <Loader2 className="animate-spin text-emerald-600 mb-4" size={40} />
          <h2 className="text-xl font-extrabold text-slate-800">Đang xác thực thanh toán</h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Vui lòng không đóng trình duyệt hoặc tải lại trang...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#ECFDF5] via-[#F9FAFB] to-[#EEF2F6] pt-32 pb-20 px-4 font-sans text-slate-700 antialiased relative overflow-hidden flex items-center justify-center">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-100/30 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/60 p-8 sm:p-10 max-w-md w-full text-center relative overflow-hidden"
      >
        {status === 'success' && (
          <>
            {/* Success View */}
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce">
              <CheckCircle2 size={36} />
            </div>

            <motion.h2 variants={itemVariants} className="text-2xl font-black text-slate-800 tracking-tight">
              Thanh Toán Thành Công!
            </motion.h2>
            <motion.p variants={itemVariants} className="text-slate-500 mt-2 text-sm font-semibold">
              Cảm ơn bạn đã lựa chọn thực phẩm sạch tại Farmily.
            </motion.p>

            {/* Order Invoice Block */}
            <motion.div
              variants={itemVariants}
              className="bg-slate-50 rounded-2xl p-5 my-6 border border-slate-100 text-left space-y-3.5 text-xs sm:text-sm font-semibold"
            >
              <div className="flex justify-between border-b border-slate-200/50 pb-2">
                <span className="text-slate-400">Mã đơn hàng:</span>
                <span className="text-slate-800 font-extrabold">{data?.orderCode || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/50 pb-2">
                <span className="text-slate-400">Phương thức:</span>
                <span className="text-emerald-700 font-extrabold">Cổng VNPAY Sandbox</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tổng thanh toán:</span>
                <span className="text-slate-800 font-black text-emerald-600 text-base">
                  {data?.total ? formatVND(data.total) : 'N/A'}
                </span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-3">
              <button
                onClick={() => navigate('/history')}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                Theo dõi đơn hàng <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/home')}
                className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag size={16} /> Tiếp tục mua sắm
              </button>
            </motion.div>
          </>
        )}

        {(status === 'failed' || status === 'error') && (
          <>
            {/* Failure/Error View */}
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <XCircle size={36} />
            </div>

            <motion.h2 variants={itemVariants} className="text-2xl font-black text-slate-800 tracking-tight">
              {status === 'failed' ? 'Thanh Toán Thất Bại' : 'Có Lỗi Xảy Ra'}
            </motion.h2>
            <motion.p variants={itemVariants} className="text-slate-500 mt-2 text-sm font-semibold">
              {status === 'failed'
                ? 'Giao dịch đã bị từ chối hoặc bị hủy bỏ từ ứng dụng ngân hàng.'
                : errorMessage || 'Không thể xác thực giao dịch thanh toán.'}
            </motion.p>

            {data?.orderCode && (
              <motion.div
                variants={itemVariants}
                className="bg-slate-50 rounded-2xl p-4 my-6 border border-slate-100 text-left text-xs sm:text-sm font-semibold"
              >
                <div className="flex justify-between">
                  <span className="text-slate-400">Mã đơn hàng liên quan:</span>
                  <span className="text-slate-800 font-extrabold">{data.orderCode}</span>
                </div>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="space-y-3 mt-6">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                Thử thanh toán lại
              </button>
              <button
                onClick={() => navigate('/home')}
                className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                Quay về trang chủ
              </button>
            </motion.div>
          </>
        )}

        {/* Security badges */}
        <div className="border-t border-slate-100 mt-6 pt-4 flex items-center justify-center gap-1.5 text-slate-400 text-xs font-semibold">
          <ShieldCheck size={14} className="text-emerald-500" />
          Bảo mật thông tin bởi cổng VNPAY
        </div>
      </motion.div>
    </div>
  );
};

export default VNPayCallback;
