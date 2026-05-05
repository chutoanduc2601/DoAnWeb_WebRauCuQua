import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import AdminModal from '../components/AdminModal';
import StatusBadge from '../components/StatusBadge';

const ITEMS_PER_PAGE = 10;
const API_BASE_URL = 'http://localhost:8082/api/admin/promotions';

const formatCurrency = (val) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

export default function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPromo, setEditPromo] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'PERCENT',
    value: 0,
    minOrderAmount: 0,
    startDate: '',
    endDate: '',
    maxUsage: '',
    status: 'ACTIVE',
    imageUrl: '',
    category: 'DISCOUNT'
  });

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE_URL);
      if (response.ok) {
        const data = await response.json();
        setPromotions(data);
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  useEffect(() => {
    if (editPromo) {
      setFormData({
        code: editPromo.code || '',
        name: editPromo.name || '',
        type: editPromo.type || 'PERCENT',
        value: editPromo.value || 0,
        minOrderAmount: editPromo.minOrderAmount || 0,
        startDate: editPromo.startDate ? editPromo.startDate.split('T')[0] : '',
        endDate: editPromo.endDate ? editPromo.endDate.split('T')[0] : '',
        maxUsage: editPromo.maxUsage || '',
        status: editPromo.status || 'ACTIVE',
        imageUrl: editPromo.imageUrl || '',
        category: editPromo.category || 'DISCOUNT'
      });
    } else {
      setFormData({
        code: '',
        name: '',
        type: 'PERCENT',
        value: 0,
        minOrderAmount: 0,
        startDate: '',
        endDate: '',
        maxUsage: '',
        status: 'ACTIVE',
        imageUrl: '',
        category: 'DISCOUNT'
      });
    }
  }, [editPromo, modalOpen]);

  const handleSave = async () => {
    setIsSaving(true);
    const url = editPromo ? `${API_BASE_URL}/${editPromo.id}` : API_BASE_URL;
    const method = editPromo ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          maxUsage: formData.maxUsage === '' ? null : parseInt(formData.maxUsage),
          startDate: formData.startDate ? `${formData.startDate}T00:00:00` : null,
          endDate: formData.endDate ? `${formData.endDate}T23:59:59` : null
        })
      });

      if (response.ok) {
        fetchPromotions();
        setModalOpen(false);
        alert(editPromo ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(`Lỗi: ${errData.message || 'Không thể lưu mã khuyến mãi'}`);
      }
    } catch (error) {
      console.error('Error saving promotion:', error);
      alert('Lỗi kết nối máy chủ');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mã khuyến mãi này?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchPromotions();
      }
    } catch (error) {
      console.error('Error deleting promotion:', error);
    }
  };

  const totalPages = Math.ceil(promotions.length / ITEMS_PER_PAGE);
  const paginated = promotions.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const columns = [
    { key: 'code', label: 'Mã', render: (val) => <span className="font-mono font-semibold text-brand-600 dark:text-brand-400 text-xs bg-brand-50 dark:bg-brand-900/20 px-2 py-1 rounded">{val}</span> },
    { key: 'name', label: 'Tên KM', render: (val) => <span className="font-medium text-slate-900 dark:text-white">{val}</span> },
    {
      key: 'value', label: 'Giá trị',
      render: (val, row) => <span className="font-medium">{row.type === 'PERCENT' ? `${val}%` : formatCurrency(val)}</span>,
    },
    { key: 'minOrderAmount', label: 'Đơn tối thiểu', render: (val) => val > 0 ? formatCurrency(val) : '—' },
    { key: 'startDate', label: 'Bắt đầu', render: (val) => val ? new Date(val).toLocaleDateString('vi-VN') : '—' },
    { key: 'endDate', label: 'Kết thúc', render: (val) => val ? new Date(val).toLocaleDateString('vi-VN') : '—' },
    { key: 'usageCount', label: 'Dùng/Tối đa', render: (val, row) => <span className="font-medium">{val || 0}/{row.maxUsage || '∞'}</span> },
    { key: 'category', label: 'Phân loại', render: (val) => {
        const labels = { 'SHIP': 'Voucher Ship', 'DISCOUNT': 'Giảm giá', 'COMBO': 'Combo' };
        return <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{labels[val] || val}</span>
      } 
    },
    { key: 'status', label: 'Trạng thái', render: (val) => <StatusBadge status={val?.toLowerCase()} /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{promotions.length} mã khuyến mãi</p>
        <button onClick={() => { setEditPromo(null); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium cursor-pointer">
          <Plus className="w-4 h-4" /> Thêm mã KM
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : (
          <>
            <DataTable columns={columns} data={paginated}
              renderActions={(row) => (
                <div className="flex items-center justify-end gap-1">
                  <button onClick={() => { setEditPromo(row); setModalOpen(true); }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 cursor-pointer">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(row.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            />
            <div className="px-4 pb-4">
              <Pagination currentPage={page} totalPages={totalPages} totalItems={promotions.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>

      <AdminModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editPromo ? 'Sửa mã khuyến mãi' : 'Thêm mã khuyến mãi'} size="lg"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">Hủy</button>
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium cursor-pointer disabled:opacity-50"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editPromo ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mã khuyến mãi</label>
            <input 
              value={formData.code} 
              onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-mono uppercase" 
              placeholder="VÍ DỤ: GIAM20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tên khuyến mãi</label>
            <input 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500" 
              placeholder="Vận may cuối tuần"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Loại giảm giá</label>
            <select 
              value={formData.type} 
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="PERCENT">Phần trăm (%)</option>
              <option value="FIXED">Cố định (VNĐ)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Giá trị giảm</label>
            <input 
              type="number" 
              value={formData.value} 
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setFormData({...formData, value: isNaN(val) ? 0 : val});
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Đơn hàng tối thiểu</label>
            <input 
              type="number" 
              value={formData.minOrderAmount} 
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setFormData({...formData, minOrderAmount: isNaN(val) ? 0 : val});
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lượt dùng tối đa</label>
            <input 
              type="number" 
              value={formData.maxUsage} 
              onChange={(e) => setFormData({...formData, maxUsage: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500" 
              placeholder="Để trống nếu không giới hạn"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ngày bắt đầu</label>
            <input 
              type="date" 
              value={formData.startDate} 
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ngày kết thúc</label>
            <input 
              type="date" 
              value={formData.endDate} 
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer" 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">URL Ảnh Poster (Hiển thị làm nền)</label>
            <input 
              value={formData.imageUrl} 
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500" 
              placeholder="Ví dụ: https://images.unsplash.com/photo-1542838132-92c53300491e"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phân loại hiển thị</label>
            <select 
              value={formData.category} 
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="SHIP">Voucher Ship (Vận chuyển)</option>
              <option value="DISCOUNT">Voucher Giảm giá (Phần trăm/Cố định)</option>
              <option value="COMBO">Voucher Combo (Mua kèm/Số lượng)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Trạng thái</label>
            <select 
              value={formData.status} 
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Tạm ngưng</option>
            </select>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
