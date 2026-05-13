import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle2, AlertCircle, Camera, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const ReturnRequestModal = ({ order, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [selectedItems, setSelectedItems] = useState([]);
  const [reason, setReason] = useState('Sản phẩm hư hỏng');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !order) return null;

  const reasons = [
    'Sản phẩm hư hỏng',
    'Sai sản phẩm',
    'Thiếu sản phẩm',
    'Chất lượng kém',
    'Khác'
  ];

  const handleToggleItem = (item) => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.filter(i => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleImageUpload = async (e) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      
      if (images.length >= 5) {
        setError('Chỉ được tải lên tối đa 5 ảnh');
        return;
      }

      setUploading(true);
      setError('');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('returns')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('returns')
        .getPublicUrl(filePath);

      setImages(prev => [...prev, data.publicUrl]);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Lỗi khi tải ảnh lên. Vui lòng thử lại. Đảm bảo bucket "returns" ở chế độ public đã được tạo trên Supabase.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      setError('Vui lòng chọn ít nhất 1 sản phẩm bị lỗi.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        orderId: order.id,
        userId: user.id,
        reason,
        description,
        imageUrls: images,
        items: selectedItems.map(item => ({
          orderItemId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const res = await fetch('http://localhost:8082/api/returns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Có lỗi xảy ra khi gửi yêu cầu.');
      }

      onSuccess();
    } catch (err) {
      setError(err.message || 'Lỗi gửi yêu cầu.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl font-black text-slate-800 mb-2">Hoàn hàng / Khiếu nại</h2>
          <p className="text-slate-500 mb-6">Đơn hàng <span className="font-bold text-emerald-600">#{order.orderCode}</span></p>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-600">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Chọn sản phẩm */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700">Sản phẩm có vấn đề <span className="text-rose-500">*</span></label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar border border-slate-100 rounded-xl p-2 bg-slate-50/50">
                {order.items?.map(item => {
                  const isSelected = selectedItems.some(i => i.id === item.id);
                  return (
                    <div 
                      key={item.id} 
                      onClick={() => handleToggleItem(item)}
                      className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors border ${
                        isSelected ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-transparent hover:border-slate-200'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                        isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <CheckCircle2 size={14} />}
                      </div>
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-slate-500">x{item.quantity} {item.unit}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lý do */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700">Lý do khiếu nại <span className="text-rose-500">*</span></label>
              <select 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700 font-medium"
              >
                {reasons.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Ảnh minh chứng */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700 flex justify-between">
                <span>Ảnh minh chứng</span>
                <span className="text-slate-400 font-normal text-xs">{images.length}/5 ảnh</span>
              </label>
              
              <div className="flex flex-wrap gap-3">
                {images.map((url, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={url} alt="Proof" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}

                {images.length < 5 && (
                  <label className={`w-20 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                    uploading ? 'border-emerald-200 bg-emerald-50 text-emerald-500' : 'border-slate-300 hover:border-emerald-400 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50/50'
                  }`}>
                    {uploading ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Camera size={20} />
                        <span className="text-[10px] font-medium">Thêm ảnh</span>
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-slate-400">Vui lòng cung cấp hình ảnh rõ nét về tình trạng sản phẩm (tối đa 5 ảnh).</p>
            </div>

            {/* Mô tả chi tiết */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700">Mô tả chi tiết</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Mô tả cụ thể vấn đề bạn gặp phải..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700 text-sm resize-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                disabled={submitting}
              >
                Hủy
              </button>
              <button 
                type="submit"
                className="flex-1 py-3 px-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Gửi yêu cầu'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ReturnRequestModal;
