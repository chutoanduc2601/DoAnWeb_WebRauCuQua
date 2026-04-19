// ===================== DANH MỤC =====================
export const categories = [
  { id: 1, name: 'Rau lá', icon: '🥬', slug: 'rau-la', description: 'Các loại rau lá xanh tươi ngon', productCount: 6 },
  { id: 2, name: 'Củ', icon: '🥕', slug: 'cu', description: 'Các loại củ giàu dinh dưỡng', productCount: 5 },
  { id: 3, name: 'Quả', icon: '🍅', slug: 'qua', description: 'Các loại quả tươi ngon mọng nước', productCount: 5 },
  { id: 4, name: 'Trái cây', icon: '🍎', slug: 'trai-cay', description: 'Trái cây nhập khẩu và nội địa', productCount: 4 },
];

// ===================== SẢN PHẨM =====================
export const products = [
  { id: 1, name: 'Rau muống hữu cơ', category: 'Rau lá', categoryId: 1, price: 15000, stock: 120, status: 'active', image: '/products/rau-muong.jpg', unit: 'bó', sold: 85 },
  { id: 2, name: 'Cải bó xôi baby', category: 'Rau lá', categoryId: 1, price: 25000, stock: 80, status: 'active', image: '/products/cai-bo-xoi.jpg', unit: 'gói 200g', sold: 62 },
  { id: 3, name: 'Xà lách Đà Lạt', category: 'Rau lá', categoryId: 1, price: 18000, stock: 95, status: 'active', image: '/products/xa-lach.jpg', unit: 'cây', sold: 110 },
  { id: 4, name: 'Rau cải ngọt', category: 'Rau lá', categoryId: 1, price: 12000, stock: 150, status: 'active', image: '/products/cai-ngot.jpg', unit: 'bó', sold: 95 },
  { id: 5, name: 'Rau mồng tơi', category: 'Rau lá', categoryId: 1, price: 10000, stock: 0, status: 'inactive', image: '/products/mong-toi.jpg', unit: 'bó', sold: 45 },
  { id: 6, name: 'Rau dền đỏ', category: 'Rau lá', categoryId: 1, price: 13000, stock: 60, status: 'active', image: '/products/rau-den.jpg', unit: 'bó', sold: 38 },
  { id: 7, name: 'Cà rốt Đà Lạt', category: 'Củ', categoryId: 2, price: 22000, stock: 200, status: 'active', image: '/products/ca-rot.jpg', unit: 'kg', sold: 150 },
  { id: 8, name: 'Khoai tây', category: 'Củ', categoryId: 2, price: 28000, stock: 180, status: 'active', image: '/products/khoai-tay.jpg', unit: 'kg', sold: 120 },
  { id: 9, name: 'Củ cải trắng', category: 'Củ', categoryId: 2, price: 16000, stock: 90, status: 'active', image: '/products/cu-cai.jpg', unit: 'kg', sold: 70 },
  { id: 10, name: 'Khoai lang mật', category: 'Củ', categoryId: 2, price: 35000, stock: 75, status: 'active', image: '/products/khoai-lang.jpg', unit: 'kg', sold: 88 },
  { id: 11, name: 'Củ dền đỏ', category: 'Củ', categoryId: 2, price: 30000, stock: 0, status: 'inactive', image: '/products/cu-den.jpg', unit: 'kg', sold: 25 },
  { id: 12, name: 'Cà chua beef', category: 'Quả', categoryId: 3, price: 40000, stock: 110, status: 'active', image: '/products/ca-chua.jpg', unit: 'kg', sold: 130 },
  { id: 13, name: 'Dưa leo baby', category: 'Quả', categoryId: 3, price: 20000, stock: 130, status: 'active', image: '/products/dua-leo.jpg', unit: 'kg', sold: 95 },
  { id: 14, name: 'Ớt chuông mix', category: 'Quả', categoryId: 3, price: 55000, stock: 60, status: 'active', image: '/products/ot-chuong.jpg', unit: 'kg', sold: 42 },
  { id: 15, name: 'Bí ngòi xanh', category: 'Quả', categoryId: 3, price: 25000, stock: 85, status: 'active', image: '/products/bi-ngoi.jpg', unit: 'kg', sold: 55 },
  { id: 16, name: 'Mướp đắng', category: 'Quả', categoryId: 3, price: 18000, stock: 70, status: 'active', image: '/products/muop-dang.jpg', unit: 'kg', sold: 35 },
  { id: 17, name: 'Táo Fuji Nhật', category: 'Trái cây', categoryId: 4, price: 89000, stock: 50, status: 'active', image: '/products/tao-fuji.jpg', unit: 'kg', sold: 200 },
  { id: 18, name: 'Nho xanh Úc', category: 'Trái cây', categoryId: 4, price: 120000, stock: 40, status: 'active', image: '/products/nho-xanh.jpg', unit: 'kg', sold: 75 },
  { id: 19, name: 'Chuối già Nam Mỹ', category: 'Trái cây', categoryId: 4, price: 32000, stock: 100, status: 'active', image: '/products/chuoi.jpg', unit: 'nải', sold: 160 },
  { id: 20, name: 'Bơ sáp Đắk Lắk', category: 'Trái cây', categoryId: 4, price: 65000, stock: 55, status: 'active', image: '/products/bo-sap.jpg', unit: 'kg', sold: 90 },
];

// ===================== ĐƠN HÀNG =====================
const orderStatuses = ['pending', 'shipping', 'delivered', 'cancelled'];
const statusLabels = { pending: 'Chờ xác nhận', shipping: 'Đang giao', delivered: 'Đã giao', cancelled: 'Đã hủy' };

export { statusLabels };

export const orders = Array.from({ length: 25 }, (_, i) => {
  const id = i + 1;
  const status = orderStatuses[i % 4];
  const customerIndex = i % 15;
  const date = new Date(2026, 3, 19 - i);
  const itemCount = (i % 3) + 1;
  const total = (Math.floor(Math.random() * 400) + 100) * 1000;
  return {
    id,
    code: `FG${String(id).padStart(5, '0')}`,
    customerName: [`Nguyễn Văn An`, `Trần Thị Bình`, `Lê Hoàng Cường`, `Phạm Minh Đức`, `Hoàng Thị Em`,
      `Vũ Đình Phúc`, `Đặng Ngọc Giang`, `Bùi Thị Hoa`, `Ngô Quang Huy`, `Đỗ Thị Kim`,
      `Lý Văn Long`, `Mai Thị Mơ`, `Trịnh Đức Nam`, `Cao Thị Oanh`, `Dương Văn Phát`][customerIndex],
    customerPhone: `09${String(10000000 + customerIndex * 1111111).slice(0, 8)}`,
    date: date.toISOString().split('T')[0],
    itemCount,
    total,
    status,
    statusLabel: statusLabels[status],
    items: Array.from({ length: itemCount }, (_, j) => {
      const p = products[(i + j) % 20];
      return { name: p.name, quantity: (j + 1), price: p.price };
    }),
    address: `${100 + i} Đường Lê Lợi, Quận ${(i % 12) + 1}, TP.HCM`,
  };
});

// ===================== KHÁCH HÀNG =====================
export const customers = [
  { id: 1, name: 'Nguyễn Văn An', email: 'an.nguyen@email.com', phone: '0901234567', orders: 12, totalSpent: 2450000, joinDate: '2025-08-15', avatar: null },
  { id: 2, name: 'Trần Thị Bình', email: 'binh.tran@email.com', phone: '0912345678', orders: 8, totalSpent: 1820000, joinDate: '2025-09-20', avatar: null },
  { id: 3, name: 'Lê Hoàng Cường', email: 'cuong.le@email.com', phone: '0923456789', orders: 15, totalSpent: 3100000, joinDate: '2025-07-10', avatar: null },
  { id: 4, name: 'Phạm Minh Đức', email: 'duc.pham@email.com', phone: '0934567890', orders: 5, totalSpent: 980000, joinDate: '2025-11-05', avatar: null },
  { id: 5, name: 'Hoàng Thị Em', email: 'em.hoang@email.com', phone: '0945678901', orders: 20, totalSpent: 4200000, joinDate: '2025-06-01', avatar: null },
  { id: 6, name: 'Vũ Đình Phúc', email: 'phuc.vu@email.com', phone: '0956789012', orders: 3, totalSpent: 650000, joinDate: '2026-01-12', avatar: null },
  { id: 7, name: 'Đặng Ngọc Giang', email: 'giang.dang@email.com', phone: '0967890123', orders: 9, totalSpent: 1950000, joinDate: '2025-10-18', avatar: null },
  { id: 8, name: 'Bùi Thị Hoa', email: 'hoa.bui@email.com', phone: '0978901234', orders: 11, totalSpent: 2680000, joinDate: '2025-08-22', avatar: null },
  { id: 9, name: 'Ngô Quang Huy', email: 'huy.ngo@email.com', phone: '0989012345', orders: 7, totalSpent: 1420000, joinDate: '2025-12-03', avatar: null },
  { id: 10, name: 'Đỗ Thị Kim', email: 'kim.do@email.com', phone: '0990123456', orders: 14, totalSpent: 3350000, joinDate: '2025-07-28', avatar: null },
  { id: 11, name: 'Lý Văn Long', email: 'long.ly@email.com', phone: '0901122334', orders: 6, totalSpent: 1150000, joinDate: '2025-11-15', avatar: null },
  { id: 12, name: 'Mai Thị Mơ', email: 'mo.mai@email.com', phone: '0912233445', orders: 18, totalSpent: 3800000, joinDate: '2025-06-20', avatar: null },
  { id: 13, name: 'Trịnh Đức Nam', email: 'nam.trinh@email.com', phone: '0923344556', orders: 4, totalSpent: 870000, joinDate: '2026-02-08', avatar: null },
  { id: 14, name: 'Cao Thị Oanh', email: 'oanh.cao@email.com', phone: '0934455667', orders: 10, totalSpent: 2100000, joinDate: '2025-09-14', avatar: null },
  { id: 15, name: 'Dương Văn Phát', email: 'phat.duong@email.com', phone: '0945566778', orders: 2, totalSpent: 420000, joinDate: '2026-03-01', avatar: null },
];

// ===================== KHUYẾN MÃI =====================
export const promotions = [
  { id: 1, code: 'WELCOME10', name: 'Chào mừng khách mới', type: 'percent', value: 10, minOrder: 200000, startDate: '2026-03-01', endDate: '2026-06-30', status: 'active', usageCount: 156 },
  { id: 2, code: 'FRESH50K', name: 'Giảm 50K đơn 500K', type: 'fixed', value: 50000, minOrder: 500000, startDate: '2026-04-01', endDate: '2026-04-30', status: 'active', usageCount: 89 },
  { id: 3, code: 'SUMMER20', name: 'Khuyến mãi hè', type: 'percent', value: 20, minOrder: 300000, startDate: '2026-06-01', endDate: '2026-08-31', status: 'inactive', usageCount: 0 },
  { id: 4, code: 'VIP15', name: 'Ưu đãi VIP', type: 'percent', value: 15, minOrder: 0, startDate: '2026-01-01', endDate: '2026-12-31', status: 'active', usageCount: 234 },
  { id: 5, code: 'FREESHIP', name: 'Miễn phí vận chuyển', type: 'fixed', value: 30000, minOrder: 150000, startDate: '2026-04-10', endDate: '2026-05-10', status: 'active', usageCount: 412 },
  { id: 6, code: 'FLASH30', name: 'Flash Sale 30%', type: 'percent', value: 30, minOrder: 400000, startDate: '2026-04-15', endDate: '2026-04-16', status: 'expired', usageCount: 67 },
  { id: 7, code: 'NEWYEAR', name: 'Năm mới 2026', type: 'percent', value: 25, minOrder: 250000, startDate: '2026-01-01', endDate: '2026-01-07', status: 'expired', usageCount: 198 },
  { id: 8, code: 'LOYALTY100K', name: 'Khách trung thành', type: 'fixed', value: 100000, minOrder: 1000000, startDate: '2026-03-15', endDate: '2026-09-15', status: 'active', usageCount: 45 },
];

// ===================== TÀI KHOẢN =====================
export const accounts = [
  { id: 1, name: 'Admin Chính', email: 'admin@freshgarden.vn', role: 'admin', status: 'active', createdAt: '2025-01-01', lastLogin: '2026-04-19' },
  { id: 2, name: 'Nguyễn Quản Lý', email: 'manager@freshgarden.vn', role: 'admin', status: 'active', createdAt: '2025-03-15', lastLogin: '2026-04-18' },
  { id: 3, name: 'Trần Nhân Viên', email: 'staff1@freshgarden.vn', role: 'staff', status: 'active', createdAt: '2025-06-20', lastLogin: '2026-04-19' },
  { id: 4, name: 'Lê Kho Hàng', email: 'warehouse@freshgarden.vn', role: 'staff', status: 'active', createdAt: '2025-08-10', lastLogin: '2026-04-17' },
  { id: 5, name: 'Phạm Cũ', email: 'old@freshgarden.vn', role: 'staff', status: 'inactive', createdAt: '2025-02-28', lastLogin: '2026-01-15' },
];

// ===================== DỮ LIỆU BIỂU ĐỒ =====================
export const revenueChart7Days = [
  { label: '13/04', value: 4200000 },
  { label: '14/04', value: 3800000 },
  { label: '15/04', value: 5100000 },
  { label: '16/04', value: 4600000 },
  { label: '17/04', value: 6200000 },
  { label: '18/04', value: 5800000 },
  { label: '19/04', value: 7100000 },
];

export const revenueChartMonthly = [
  { label: 'T1', value: 85000000 },
  { label: 'T2', value: 72000000 },
  { label: 'T3', value: 95000000 },
  { label: 'T4', value: 110000000 },
  { label: 'T5', value: 0 },
  { label: 'T6', value: 0 },
  { label: 'T7', value: 0 },
  { label: 'T8', value: 0 },
  { label: 'T9', value: 0 },
  { label: 'T10', value: 0 },
  { label: 'T11', value: 0 },
  { label: 'T12', value: 0 },
];

export const topSellingProducts = [
  { label: 'Táo Fuji', value: 200 },
  { label: 'Chuối', value: 160 },
  { label: 'Cà rốt', value: 150 },
  { label: 'Cà chua', value: 130 },
  { label: 'Khoai tây', value: 120 },
];

// ===================== DASHBOARD STATS =====================
export const dashboardStats = {
  revenue: { value: 36800000, trend: 12.5, label: 'Doanh thu tháng' },
  orders: { value: 156, trend: 8.2, label: 'Đơn hàng' },
  products: { value: 20, trend: 0, label: 'Sản phẩm' },
  customers: { value: 15, trend: 15.3, label: 'Khách hàng' },
};

// ===================== HELPERS =====================
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export const formatNumber = (value) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};
