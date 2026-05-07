import React, { useState, useEffect } from 'react';
import { Search, Eye, RefreshCw, CheckCircle } from 'lucide-react';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import AdminModal from '../components/AdminModal';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency } from '../data/adminMockData';

const ITEMS_PER_PAGE = 10;
const API_URL = 'http://localhost:8082/api/orders';

const tabs = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ xác nhận' },
  { key: 'confirmed', label: 'Đã xác nhận' },
  { key: 'processing', label: 'Đang chuẩn bị' },
  { key: 'shipping', label: 'Đang giao' },
  { key: 'delivered', label: 'Đã giao' },
  { key: 'cancelled', label: 'Đã hủy' },
];

export default function Orders() {
  const [dbOrders, setDbOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [trackingHistory, setTrackingHistory] = useState([]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const statusParam = activeTab === 'all' ? '' : `&status=${activeTab.toUpperCase()}`;
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const res = await fetch(`${API_URL}/paged?page=${page - 1}&size=${ITEMS_PER_PAGE}${searchParam}${statusParam}`);
      const data = await res.json();
      
      if (data && data.content) {
        setDbOrders(data.content);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.totalElements || 0);
      } else {
        setDbOrders([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
      setDbOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, search, activeTab]);

  const fetchTracking = async (orderId) => {
    try {
      const res = await fetch(`${API_URL}/${orderId}/tracking`);
      const data = await res.json();
      setTrackingHistory(data);
    } catch (error) {
      console.error('Failed to fetch tracking', error);
    }
  };

  useEffect(() => {
    if (selectedOrder) {
      fetchTracking(selectedOrder.id);
      setUpdateDescription('');
    }
  }, [selectedOrder]);

  const handleUpdateStatus = async (statusOverride = null) => {
    const statusToUse = statusOverride || updateStatus;
    if (!selectedOrder || !statusToUse) return;
    try {
      const res = await fetch(`${API_URL}/${selectedOrder.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: statusToUse,
          description: updateDescription
        })
      });
      
      if (!res.ok) throw new Error('Cannot update order status');

      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      alert('Không thể cập nhật trạng thái đơn hàng.');
      console.error('Failed to update status', error);
    }
  };

  const columns = [
    { key: 'id', label: 'Mã đơn', render: (val, row) => <span className="font-medium text-brand-600 dark:text-brand-400">#{row.orderCode || val}</span> },
    { key: 'fullName', label: 'Khách hàng' },
    { key: 'createdAt', label: 'Ngày đặt', render: (val) => val ? new Date(val).toLocaleDateString('vi-VN') : '—' },
    { key: 'items', label: 'Số SP', render: (val) => val ? val.length : 0 },
    { key: 'total', label: 'Tổng tiền', render: (val) => <span className="font-medium">{formatCurrency(val)}</span> },
    { key: 'status', label: 'Trạng thái', render: (val) => <StatusBadge status={val?.toLowerCase()} /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-brand-500 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button onClick={fetchOrders} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer">
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 gap-2 w-full sm:w-72">
        <Search className="w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Tìm mã đơn, khách hàng..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 outline-none w-full" />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <DataTable columns={columns} data={dbOrders}
          renderActions={(row) => (
            <div className="flex gap-1">
              <button onClick={() => { setSelectedOrder(row); setUpdateStatus(row.status || 'pending'); }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 cursor-pointer" title="Xem chi tiết">
                <Eye className="w-4 h-4" />
              </button>
              {row.status === 'PENDING' && (
                <button 
                  onClick={async () => {
                    setSelectedOrder(row); // Set for context if needed, though handleUpdateStatus below needs a slight change if called directly
                    // To avoid complications, let's just make a direct quick confirm call
                    if (window.confirm(`Xác nhận đơn hàng #${row.orderCode}?`)) {
                      try {
                        const res = await fetch(`${API_URL}/${row.id}/status`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: 'CONFIRMED', description: 'Đơn hàng đã được xác nhận nhanh' })
                        });
                        if (res.ok) fetchOrders();
                      } catch (err) { console.error(err); }
                    }
                  }} 
                  className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-600 cursor-pointer" 
                  title="Xác nhận nhanh"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        />
        <div className="px-4 pb-4">
          <Pagination currentPage={page} totalPages={totalPages} totalItems={totalItems} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} />
        </div>
      </div>

      <AdminModal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Chi tiết đơn #${selectedOrder?.orderCode || selectedOrder?.id || ''}`} size="md"
        footer={
          <>
            <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">Đóng</button>
            {selectedOrder?.status === 'PENDING' && (
              <button 
                onClick={() => handleUpdateStatus('CONFIRMED')} 
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium cursor-pointer"
              >
                Xác nhận đơn hàng
              </button>
            )}
            <button onClick={() => handleUpdateStatus()} className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium cursor-pointer">Lưu trạng thái</button>
          </>
        }
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-slate-500 dark:text-slate-400">Khách hàng:</span> <span className="font-medium text-slate-900 dark:text-white ml-1">{selectedOrder.fullName}</span></div>
              <div><span className="text-slate-500 dark:text-slate-400">SĐT:</span> <span className="font-medium text-slate-900 dark:text-white ml-1">{selectedOrder.phone}</span></div>
              <div><span className="text-slate-500 dark:text-slate-400">Ngày đặt:</span> <span className="font-medium text-slate-900 dark:text-white ml-1">{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString('vi-VN') : '—'}</span></div>
              <div className="flex items-center gap-2">
                <select value={updateStatus} onChange={(e) => setUpdateStatus(e.target.value)} className="text-sm border border-slate-200 dark:border-slate-700 bg-transparent rounded px-2 py-1 outline-none cursor-pointer text-slate-900 dark:text-white">
                  <option value="PENDING">Chờ xác nhận</option>
                  <option value="CONFIRMED">Đã xác nhận</option>
                  <option value="PROCESSING">Đang chuẩn bị</option>
                  <option value="SHIPPING">Đang giao hàng</option>
                  <option value="DELIVERED">Đã giao hàng</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 dark:text-slate-400 block mb-1">Ghi chú trạng thái (tùy chọn):</span>
                <input 
                  type="text" 
                  value={updateDescription} 
                  onChange={(e) => setUpdateDescription(e.target.value)}
                  placeholder="Ví dụ: Đang đóng gói hàng, Shipper đã lấy hàng..."
                  className="w-full text-sm border border-slate-200 dark:border-slate-700 bg-transparent rounded px-3 py-2 outline-none text-slate-900 dark:text-white"
                />
              </div>
              <div className="col-span-2"><span className="text-slate-500 dark:text-slate-400">Địa chỉ:</span> <span className="font-medium text-slate-900 dark:text-white ml-1">{selectedOrder.address}</span></div>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Lịch trình đơn hàng</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {trackingHistory.map((t, idx) => (
                  <div key={idx} className="flex gap-3 text-xs">
                    <div className="flex flex-col items-center">
                      <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-brand-500' : 'bg-slate-300'} mt-1.5`} />
                      {idx !== trackingHistory.length - 1 && <div className="w-px flex-1 bg-slate-200 my-1" />}
                    </div>
                    <div className="pb-3">
                      <p className={`font-medium ${idx === 0 ? 'text-brand-600' : 'text-slate-700 dark:text-slate-300'}`}>{t.description}</p>
                      <p className="text-slate-400">{new Date(t.createdAt).toLocaleString('vi-VN')}</p>
                    </div>
                  </div>
                ))}
                {trackingHistory.length === 0 && <p className="text-slate-400 italic text-xs">Chưa có lịch trình.</p>}
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Sản phẩm</h4>
              {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2 text-sm border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                  <span className="text-slate-700 dark:text-slate-300">{item.name} x{item.quantity} {item.unit}</span>
                  <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-3 text-sm font-semibold">
                <span className="text-slate-900 dark:text-white">Tổng cộng</span>
                <span className="text-brand-600 dark:text-brand-400">{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
