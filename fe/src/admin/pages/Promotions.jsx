import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import AdminModal from '../components/AdminModal';
import StatusBadge from '../components/StatusBadge';
import { promotions as allPromotions, formatCurrency } from '../data/adminMockData';

const ITEMS_PER_PAGE = 10;

export default function Promotions() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPromo, setEditPromo] = useState(null);

  const totalPages = Math.ceil(allPromotions.length / ITEMS_PER_PAGE);
  const paginated = allPromotions.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const columns = [
    { key: 'code', label: 'Mã', render: (val) => <span className="font-mono font-semibold text-brand-600 dark:text-brand-400 text-xs bg-brand-50 dark:bg-brand-900/20 px-2 py-1 rounded">{val}</span> },
    { key: 'name', label: 'Tên KM', render: (val) => <span className="font-medium text-slate-900 dark:text-white">{val}</span> },
    {
      key: 'value', label: 'Giá trị',
      render: (val, row) => <span className="font-medium">{row.type === 'percent' ? `${val}%` : formatCurrency(val)}</span>,
    },
    { key: 'minOrder', label: 'Đơn tối thiểu', render: (val) => val > 0 ? formatCurrency(val) : '—' },
    { key: 'startDate', label: 'Bắt đầu' },
    { key: 'endDate', label: 'Kết thúc' },
    { key: 'usageCount', label: 'Lượt dùng', render: (val) => <span className="font-medium">{val}</span> },
    { key: 'status', label: 'Trạng thái', render: (val) => <StatusBadge status={val} /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{allPromotions.length} mã khuyến mãi</p>
        <button onClick={() => { setEditPromo(null); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium cursor-pointer">
          <Plus className="w-4 h-4" /> Thêm mã KM
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <DataTable columns={columns} data={paginated}
          renderActions={(row) => (
            <div className="flex items-center justify-end gap-1">
              <button onClick={() => { setEditPromo(row); setModalOpen(true); }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 cursor-pointer">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        />
        <div className="px-4 pb-4">
          <Pagination currentPage={page} totalPages={totalPages} totalItems={allPromotions.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} />
        </div>
      </div>

      <AdminModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editPromo ? 'Sửa mã khuyến mãi' : 'Thêm mã khuyến mãi'} size="lg"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">Hủy</button>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium cursor-pointer">{editPromo ? 'Cập nhật' : 'Thêm mới'}</button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mã khuyến mãi</label>
            <input defaultValue={editPromo?.code || ''} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-mono uppercase" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tên khuyến mãi</label>
            <input defaultValue={editPromo?.name || ''} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Loại giảm giá</label>
            <select defaultValue={editPromo?.type || 'percent'} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer">
              <option value="percent">Phần trăm (%)</option>
              <option value="fixed">Cố định (VNĐ)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Giá trị</label>
            <input type="number" defaultValue={editPromo?.value || ''} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ngày bắt đầu</label>
            <input type="date" defaultValue={editPromo?.startDate || ''} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ngày kết thúc</label>
            <input type="date" defaultValue={editPromo?.endDate || ''} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer" />
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
