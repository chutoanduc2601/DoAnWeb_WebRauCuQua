import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import AdminModal from '../components/AdminModal';
import StatusBadge from '../components/StatusBadge';
import { categories, formatCurrency } from '../admin/data/adminMockData';

const ITEMS_PER_PAGE = 10;
const API_URL = 'http://localhost:8082/api/products';

export default function Products() {
  const [dbProducts, setDbProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '', categoryId: '', price: '', unit: '', stock: '', status: 'active'
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setDbProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (editProduct) {
      const cat = categories.find(c => c.name === editProduct.category);
      setFormData({
        name: editProduct.name || '',
        categoryId: cat ? cat.id : '',
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
    const categoryName = categories.find(c => Number(c.id) === Number(formData.categoryId))?.name || '';
    const productPayload = {
      name: formData.name,
      price: Number(formData.price),
      unit: formData.unit,
      category: categoryName,
      stock: Number(formData.stock),
      status: formData.status,
      sold: editProduct ? editProduct.sold : 0
    };

    try {
      if (editProduct) {
        await fetch(`${API_URL}/${editProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productPayload)
        });
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productPayload)
        });
      }
      setModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const filtered = useMemo(() => {
    return dbProducts.filter(p => {
      const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
      const cat = categories.find(c => c.name === p.category);
      const categoryId = cat ? cat.id : -1;
      const matchCat = filterCat === 'all' || categoryId === Number(filterCat);
      return matchSearch && matchCat;
    });
  }, [search, filterCat, dbProducts]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const columns = [
    {
      key: 'name', label: 'Sản phẩm',
      render: (val, row) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 text-brand-500" />
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white text-sm">{val}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{row.category}</p>
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
              data={paginated}
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
            <Pagination currentPage={page} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

