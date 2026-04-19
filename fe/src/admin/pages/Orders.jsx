import React, { useState, useMemo } from 'react';
import { Search, Eye } from 'lucide-react';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import AdminModal from '../components/AdminModal';
import StatusBadge from '../components/StatusBadge';
import { orders as allOrders, formatCurrency } from '../data/adminMockData';

const ITEMS_PER_PAGE = 10;
const tabs = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ xác nhận' },
  { key: 'shipping', label: 'Đang giao' },
  { key: 'delivered', label: 'Đã giao' },
  { key: 'cancelled', label: 'Đã hủy' },
];

export default function Orders() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filtered = useMemo(() => {
    return allOrders.filter(o => {
      const matchTab = activeTab === 'all' || o.status === activeTab;
      const matchSearch = o.code.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [activeTab, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const columns = [
    { key: 'code', label: 'Mã đơn', render: (val) => <span className="font-medium text-brand-600 dark:text-brand-400">{val}</span> },
    { key: 'customerName', label: 'Khách hàng' },
    { key: 'date', label: 'Ngày đặt' },
    { key: 'itemCount', label: 'Số SP' },
    { key: 'total', label: 'Tổng tiền', render: (val) => <span className="font-medium">{formatCurrency(val)}</span> },
    { key: 'status', label: 'Trạng thái', render: (val) => <StatusBadge status={val} /> },
  ];

  return (
    <div className="space-y-4">
      {/* Tabs */}
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

      {/* Search */}
      <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 gap-2 w-full sm:w-72">
        <Search className="w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Tìm mã đơn, khách hàng..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 outline-none w-full" />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <DataTable columns={columns} data={paginated}
          renderActions={(row) => (
            <button onClick={() => setSelectedOrder(row)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 cursor-pointer">
              <Eye className="w-4 h-4" />
            </button>
          )}
        />
        <div className="px-4 pb-4">
          <Pagination currentPage={page} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} />
        </div>
      </div>

      {/* Order Detail Modal */}
      <AdminModal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Chi tiết đơn ${selectedOrder?.code || ''}`} size="md">
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-slate-500 dark:text-slate-400">Khách hàng:</span> <span className="font-medium text-slate-900 dark:text-white ml-1">{selectedOrder.customerName}</span></div>
              <div><span className="text-slate-500 dark:text-slate-400">SĐT:</span> <span className="font-medium text-slate-900 dark:text-white ml-1">{selectedOrder.customerPhone}</span></div>
              <div><span className="text-slate-500 dark:text-slate-400">Ngày đặt:</span> <span className="font-medium text-slate-900 dark:text-white ml-1">{selectedOrder.date}</span></div>
              <div><span className="text-slate-500 dark:text-slate-400">Trạng thái:</span> <span className="ml-1"><StatusBadge status={selectedOrder.status} /></span></div>
              <div className="col-span-2"><span className="text-slate-500 dark:text-slate-400">Địa chỉ:</span> <span className="font-medium text-slate-900 dark:text-white ml-1">{selectedOrder.address}</span></div>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Sản phẩm</h4>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2 text-sm border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                  <span className="text-slate-700 dark:text-slate-300">{item.name} x{item.quantity}</span>
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
