import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import { Plus, Search, Edit, Trash2, Package, Image as ImageIcon } from 'lucide-react';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import AdminModal from '../components/AdminModal';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency } from '../data/adminMockData';

const ITEMS_PER_PAGE = 10;
const API_URL = `${API_BASE_URL}/api/products`;

export default function Products() {
  const [dbProducts, setDbProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Form states
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '', categoryId: '', price: '', unit: '', stock: '', status: 'active'
  });

  const fetchProducts = async () => {
    try {
      const catParam = filterCat === 'all' ? '' : `&categoryId=${filterCat}`;
      const searchParam = search ? `&name=${encodeURIComponent(search)}` : '';
      const res = await fetch(`${API_URL}/paged?page=${page - 1}&size=${ITEMS_PER_PAGE}${searchParam}${catParam}`);
      const data = await res.json();
      
      if (data && data.content) {
        setDbProducts(data.content);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.totalElements || 0);
      } else {
        setDbProducts(Array.isArray(data) ? data : []);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setDbProducts([]);
    }
  };
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Fetch products when page, search, or filter changes
    // Using a simple timeout for debouncing search
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, search, filterCat]);

  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name || '',
        categoryId: editProduct.category?.id || '',
        price: editProduct.price || '',
        unit: editProduct.unit || '',
        stock: editProduct.stock || 0,
        status: editProduct.status || 'active'
      });
    } else {
      setFormData({ name: '', categoryId: '', price: '', unit: '', stock: '', status: 'active' });
    }
  }, [editProduct]);

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.categoryId || !formData.price) {
      alert('Vui lòng nhập tên, giá và chọn danh mục sản phẩm!');
      return;
    }

    const productPayload = {
      name: formData.name,
      price: Number(formData.price),
      unit: formData.unit,
      category: { id: Number(formData.categoryId) },
      stock: Number(formData.stock),
      status: formData.status,
      sold: editProduct ? editProduct.sold : 0,
      imageUrl: editProduct ? editProduct.imageUrl : null,
      tags: editProduct ? editProduct.tags : null,
      badge: editProduct ? editProduct.badge : null
    };

    try {
      let res;
      if (editProduct) {
        res = await fetch(`${API_URL}/${editProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productPayload)
        });
      } else {
        res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productPayload)
        });
      }
      
      if (!res.ok) throw new Error('Cannot save product');
      
      setModalOpen(false);
      fetchProducts();
    } catch (error) {
      alert('Không thể lưu sản phẩm. Vui lòng kiểm tra lại thông tin.');
      console.error('Failed to save product:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Cannot delete product');
      fetchProducts();
    } catch (error) {
      alert('Không thể xóa sản phẩm này (có thể đang có trong đơn hàng).');
      console.error('Failed to delete product:', error);
    }
  };

  const columns = [
    {
      key: 'name', label: 'Sản phẩm',
      render: (val, row) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-600">
              {row.imageUrl ? (
                <img src={row.imageUrl} alt={val} className="w-full h-full object-cover" />
              ) : (
                <Package className="w-5 h-5 text-slate-400" />
              )}
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white text-sm line-clamp-1">{val}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{row.category?.name || 'N/A'}</p>
            </div>
          </div>
      ),
    },
    { key: 'price', label: 'Giá', render: (val) => <span className="font-medium">{formatCurrency(val)}</span> },
    {
      key: 'stock', label: 'Tồn kho',
      render: (val) => (
          <span className={`font-medium ${val === 0 ? 'text-red-500' : val < 50 ? 'text-amber-500' : 'text-slate-700 dark:text-slate-300'}`}>
          {val}
        </span>
      ),
    },
    { key: 'sold', label: 'Đã bán' },
    { key: 'status', label: 'Trạng thái', render: (val) => <StatusBadge status={val} /> },
  ];

  return (
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 gap-2 flex-1 sm:flex-none">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                  type="text"
                  placeholder="Tìm sản phẩm..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 outline-none w-full sm:w-48"
              />
            </div>
            <select
                value={filterCat}
                onChange={e => { setFilterCat(e.target.value); setPage(1); }}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button
              onClick={() => { setEditProduct(null); setModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Thêm sản phẩm
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <DataTable
              columns={columns}
              data={dbProducts}
              renderActions={(row) => (
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => { setEditProduct(row); setModalOpen(true); }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 cursor-pointer">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(row.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
              )}
          />
          <div className="px-4 pb-4">
            <Pagination currentPage={page} totalPages={totalPages} totalItems={totalItems} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} />
          </div>
        </div>

        {/* Add/Edit Modal */}
        <AdminModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'} size="lg"
                    footer={
                      <>
                        <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">Hủy</button>
                        <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium cursor-pointer">{editProduct ? 'Cập nhật' : 'Thêm mới'}</button>
                      </>
                    }
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tên sản phẩm</label>
              <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Danh mục</label>
              <select value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer">
                <option value="">Chọn danh mục</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ảnh sản phẩm (URL)</label>
            <div className="flex gap-4">
              <div className="flex-1">
                <input 
                  value={formData.imageUrl} 
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} 
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500" 
                />
                <p className="text-[10px] text-slate-400 mt-1 italic">* Dán link ảnh từ Supabase hoặc các nguồn ảnh khác.</p>
              </div>
              <div className="w-16 h-16 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center justify-center overflow-hidden shrink-0">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.src='https://via.placeholder.com/150?text=Error'} />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-300" />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Giá (VNĐ)</label>
              <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Đơn vị</label>
              <input value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tồn kho</label>
              <input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Trạng thái</label>
              <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer">
                <option value="active">Đang bán</option>
                <option value="inactive">Ngưng bán</option>
              </select>
            </div>
          </div>
        </AdminModal>
      </div>
  );
}

