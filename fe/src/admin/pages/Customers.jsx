import React, { useState, useMemo } from 'react';
import { Search, Eye, User } from 'lucide-react';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import AdminModal from '../components/AdminModal';
import { customers as allCustomers, formatCurrency } from '../data/adminMockData';

const ITEMS_PER_PAGE = 10;

export default function Customers() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filtered = useMemo(() => {
    return allCustomers.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const columns = [
    {
      key: 'name', label: 'Khách hàng',
      render: (val) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          </div>
          <span className="font-medium text-slate-900 dark:text-white">{val}</span>
        </div>
      ),
    },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'SĐT' },
    { key: 'orders', label: 'Số đơn', render: (val) => <span className="font-medium">{val}</span> },
    { key: 'totalSpent', label: 'Tổng chi tiêu', render: (val) => <span className="font-medium">{formatCurrency(val)}</span> },
    { key: 'joinDate', label: 'Ngày tham gia' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 gap-2 w-full sm:w-72">
        <Search className="w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Tìm khách hàng..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 outline-none w-full" />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <DataTable columns={columns} data={paginated}
          renderActions={(row) => (
            <button onClick={() => setSelectedCustomer(row)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 cursor-pointer">
              <Eye className="w-4 h-4" />
            </button>
          )}
        />
        <div className="px-4 pb-4">
          <Pagination currentPage={page} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} />
        </div>
      </div>

      <AdminModal isOpen={!!selectedCustomer} onClose={() => setSelectedCustomer(null)} title="Chi tiết khách hàng" size="md">
        {selectedCustomer && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                <User className="w-8 h-8 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{selectedCustomer.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{selectedCustomer.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">SĐT</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">{selectedCustomer.phone}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">Ngày tham gia</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">{selectedCustomer.joinDate}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">Tổng đơn hàng</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">{selectedCustomer.orders}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">Tổng chi tiêu</p>
                <p className="text-sm font-medium text-brand-600 dark:text-brand-400 mt-1">{formatCurrency(selectedCustomer.totalSpent)}</p>
              </div>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
