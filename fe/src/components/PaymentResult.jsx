import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PaymentResult = () => {
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'failed'
  const [message, setMessage] = useState('Đang kiểm tra trạng thái giao dịch...');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Check MoMo format
    const momoResultCode = params.get('resultCode');
    // Check PayOS format
    const payOsCode = params.get('code');
    const payOsCancel = params.get('cancel');

    setTimeout(() => {
      if (momoResultCode !== null) {
        if (momoResultCode === '0') {
          setStatus('success');
          setMessage('Thanh toán thành công qua MoMo!');
        } else {
          setStatus('failed');
          setMessage('Thanh toán MoMo thất bại hoặc đã bị hủy.');
        }
      } else if (payOsCode !== null) {
        if (payOsCode === '00' && payOsCancel === 'false') {
          setStatus('success');
          setMessage('Chuyển khoản thành công!');
        } else {
          setStatus('failed');
          setMessage('Giao dịch chuyển khoản đã bị hủy hoặc thất bại.');
        }
      } else {
        setStatus('failed');
        setMessage('Không tìm thấy thông tin giao dịch.');
      }
    }, 1500); // Simulate loading for UX
  }, [location]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl shadow-slate-200/50"
      >
        {status === 'loading' && (
          <div className="py-12 flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mb-6" />
            <h2 className="text-xl font-bold text-slate-800">Đang xử lý</h2>
            <p className="text-slate-500 mt-2">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-8 flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Giao Dịch Thành Công</h2>
            <p className="text-slate-500 mb-8">{message}</p>
            
            <Link 
              to="/history" 
              className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              Xem đơn hàng <ArrowRight size={18} />
            </Link>
            <button 
              onClick={() => navigate('/')}
              className="w-full py-3.5 mt-3 text-emerald-600 font-bold hover:bg-emerald-50 rounded-xl transition-colors"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        )}

        {status === 'failed' && (
          <div className="py-8 flex flex-col items-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Thanh Toán Thất Bại</h2>
            <p className="text-slate-500 mb-8">{message}</p>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors"
            >
              Thử lại thanh toán
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full py-3.5 mt-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
            >
              Quay về trang chủ
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentResult;
