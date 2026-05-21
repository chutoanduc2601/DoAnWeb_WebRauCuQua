import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertCircle, RefreshCw, X, Image as ImageIcon, ExternalLink, Check, Ban, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../../config';

const formatVND = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const STATUS_MAP = {
  PENDING: { label: 'Chờ xử lý', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  WAITING_REFUND: { label: 'Chờ hoàn tiền', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  REFUNDED: { label: 'Đã hoàn tiền', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  REJECTED: { label: 'Từ chối', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' }
};

export default function Returns() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const size = 10;

  // Modals
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [imagesModal, setImagesModal] = useState(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    fetchRequests();
  }, [page, searchTerm, statusFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        size
      });
      if (statusFilter) params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);

      const res = await fetch(`${API_BASE_URL}/api/returns/paged?${params}`);
      if (res.ok) {
        const data = await res.json();
        // Parse imageUrls from JSON string to array
        const parsed = (data.content || []).map(r => ({
          ...r,
          imageUrls: (() => {
            try { return JSON.parse(r.imageUrls || '[]'); } catch { return []; }
          })()
        }));
        setRequests(parsed);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    if (!window.confirm(`Bạn có chắc muốn chuyển trạng thái thành: ${STATUS_MAP[newStatus].label}?`)) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/returns/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminNote: note })
      });

      if (res.ok) {
        setSelectedRequest(null);
        setNote('');
        fetchRequests();
      } else {
        alert('Cập nhật thất bại!');
      }
    } catch (error) {
      console.error(error);
      alert('Lỗi kết nối!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Tìm theo mã đơn hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none text-slate-700 dark:text-slate-200"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Chờ xử lý</option>
            <option value="WAITING_REFUND">Chờ hoàn tiền</option>
            <option value="REFUNDED">Đã hoàn tiền</option>
            <option value="REJECTED">Từ chối</option>
          </select>
          <button 
            onClick={fetchRequests}
            className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Khách hàng</th>
                <th className="p-4 font-medium">Đơn hàng</th>
                <th className="p-4 font-medium">Lý do</th>
                <th className="p-4 font-medium">Thời gian</th>
                <th className="p-4 font-medium">Trạng thái</th>
                <th className="p-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {requests.map(req => (
                <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-4">
                    <div className="font-medium text-slate-900 dark:text-white">{req.order?.fullName || 'Khách hàng'}</div>
                    <div className="text-xs text-slate-500">{req.order?.phone || 'N/A'}</div>
                  </td>
                  <td className="p-4 font-medium text-slate-700 dark:text-slate-300">
                    {req.order?.orderCode}
                  </td>
                  <td className="p-4">
                    <div className="text-slate-700 dark:text-slate-300 font-medium">{req.reason}</div>
                    <div className="text-xs text-slate-500 truncate max-w-[200px]">{req.description}</div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">
                    {new Date(req.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${STATUS_MAP[req.status].bg} ${STATUS_MAP[req.status].color}`}>
                      {STATUS_MAP[req.status].label}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => { setSelectedRequest(req); setNote(req.adminNote || ''); }}
                      className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 text-xs font-medium rounded-lg transition-colors"
                    >
                      Xử lý
                    </button>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">Không tìm thấy yêu cầu khiếu nại nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                page === i 
                ? 'bg-brand-500 text-white' 
                : 'bg-white dark:bg-slate-900 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">Chi tiết Khiếu nại</h3>
                <button onClick={() => setSelectedRequest(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Mã đơn hàng</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{selectedRequest.order?.orderCode}</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Trạng thái hiện tại</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${STATUS_MAP[selectedRequest.status].bg} ${STATUS_MAP[selectedRequest.status].color}`}>
                      {STATUS_MAP[selectedRequest.status].label}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-3">Sản phẩm khiếu nại</h4>
                  <div className="space-y-2">
                    {selectedRequest.items.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <div>
                          <p className="font-medium text-sm text-slate-800 dark:text-slate-200">{item.productName}</p>
                          <p className="text-xs text-slate-500">Số lượng: {item.quantity}</p>
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{formatVND(item.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-2">Lý do & Mô tả</h4>
                  <div className="p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-xl">
                    <p className="font-bold text-rose-700 dark:text-rose-400">{selectedRequest.reason}</p>
                    <p className="text-sm text-rose-600/80 dark:text-rose-300 mt-1">{selectedRequest.description || 'Không có mô tả'}</p>
                  </div>
                </div>

                {selectedRequest.imageUrls?.length > 0 && (
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-2">Hình ảnh chứng minh</h4>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {selectedRequest.imageUrls.map((url, idx) => (
                        <img 
                          key={idx} 
                          src={url} 
                          alt="Proof" 
                          onClick={() => setImagesModal(selectedRequest.imageUrls)}
                          className="w-20 h-20 rounded-lg object-cover border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity shrink-0" 
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-2">Ghi chú của Admin (Tùy chọn)</h4>
                  <textarea 
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Nhập ghi chú phản hồi cho khách hàng..."
                    className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-slate-800 dark:text-slate-200 resize-none h-24"
                  />
                </div>
              </div>

              <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-wrap gap-2 justify-end">
                {selectedRequest.status === 'PENDING' && (
                  <>
                    <button 
                      onClick={() => handleUpdateStatus(selectedRequest.id, 'REJECTED')}
                      className="px-4 py-2 bg-white border border-rose-200 text-rose-600 font-medium rounded-lg hover:bg-rose-50 flex items-center gap-2 text-sm"
                    >
                      <Ban size={16} /> Từ chối
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedRequest.id, 'WAITING_REFUND')}
                      className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 flex items-center gap-2 text-sm"
                    >
                      <Check size={16} /> Duyệt (Chờ hoàn tiền)
                    </button>
                  </>
                )}
                
                {selectedRequest.status === 'WAITING_REFUND' && (
                  <button 
                    onClick={() => handleUpdateStatus(selectedRequest.id, 'REFUNDED')}
                    className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 flex items-center gap-2 text-sm"
                  >
                    <DollarSign size={16} /> Xác nhận đã hoàn tiền
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {imagesModal && (
          <div 
            className="fixed inset-0 z-[110] bg-black/90 flex flex-col items-center justify-center"
            onClick={() => setImagesModal(null)}
          >
            <button className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full">
              <X size={24} />
            </button>
            <div className="flex gap-4 overflow-x-auto p-4 snap-x max-w-full" onClick={e => e.stopPropagation()}>
              {imagesModal.map((url, i) => (
                <img key={i} src={url} alt="Full Proof" className="max-h-[80vh] w-auto snap-center rounded-lg shadow-2xl" />
              ))}
            </div>
            <p className="text-white/60 text-sm mt-4">Vuốt để xem các ảnh khác</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
