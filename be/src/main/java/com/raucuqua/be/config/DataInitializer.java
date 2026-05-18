package com.raucuqua.be.config;

import com.raucuqua.be.entity.Category;
import com.raucuqua.be.entity.Product;
import com.raucuqua.be.repository.CategoryRepository;
import com.raucuqua.be.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

// @Component  // Disabled: DB already initialized, no need to run count queries on startup
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            initializeCategories();
        }
        
        if (productRepository.count() == 0) {
            initializeProducts();
        }
    }

    private void initializeCategories() {
        Category rau = new Category(null, "Rau", "rau", "LeafyGreen", "Các loại rau xanh tươi sạch", null);
        Category cu = new Category(null, "Củ", "cu", "Carrot", "Các loại củ quả giàu dinh dưỡng", null);
        Category traiCay = new Category(null, "Trái cây", "trai-cay", "Apple", "Trái cây tươi ngon mỗi ngày", null);
        Category giaVi = new Category(null, "Gia vị", "gia-vi", "Spices", "Hành, tỏi, ớt và các loại gia vị", null);

        categoryRepository.saveAll(Arrays.asList(rau, cu, traiCay, giaVi));
    }

    private void initializeProducts() {
        Map<String, Category> catMap = new HashMap<>();
        categoryRepository.findAll().forEach(c -> catMap.put(c.getName(), c));

        Category rau = catMap.get("Rau");
        Category cu = catMap.get("Củ");
        Category traiCay = catMap.get("Trái cây");
        Category giaVi = catMap.get("Gia vị");

        // Nhóm Rau
        saveProduct("Súp lơ xanh Đà Lạt", 45000.0, "kg", rau, "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c", new String[]{"Organic", "VietGAP"}, "Gym Choice");
        saveProduct("Rau muống sạch", 15000.0, "bó", rau, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaOG3BKFO5ER5tdqGLtuIYnnLciVvmaQRu_jLtH8pRvZW-Dn0FXpnO_qjMn-Dg2eElj9QHaiyzDMavt6H-g57xnCek3CM9ICMDyJTqKa8PNQ&s", new String[]{"VietGAP"}, null);
        saveProduct("Cải kale organic", 65000.0, "túi", rau, "https://bizweb.dktcdn.net/thumb/1024x1024/100/390/808/products/kale-144-1483973379.png?v=1593855434387", new String[]{"Organic"}, "Superfood");
        saveProduct("Xà lách thủy canh", 35000.0, "kg", rau, "https://images.unsplash.com/photo-1556801712-76c8220a3992?w=800", new String[]{"Organic"}, null);

        // Nhóm Củ
        saveProduct("Cà rốt hữu cơ", 30000.0, "kg", cu, "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2022/6/9/tre-bi-tieu-chay-nen-an-gi1-1654778451996721215585.jpg", new String[]{"Organic"}, null);
        saveProduct("Khoai tây Đà Lạt", 25000.0, "kg", cu, "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800", new String[]{"VietGAP"}, null);
        saveProduct("Củ dền đỏ", 40000.0, "kg", cu, "https://www.vinmec.com/static/uploads/20210519_081753_529664_cho_be_an_rau_cu_de_max_1800x1800_jpg_e77bfe6a3d.jpg", new String[]{"Organic"}, "Superfood");
        saveProduct("Khoai lang tím", 35000.0, "kg", cu, "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2022/10/24/1-16665990388471964576477.jpg", new String[]{"VietGAP"}, "Diet Choice");

        // Nhóm Gia vị
        saveProduct("Hành tây", 20000.0, "kg", giaVi, "https://images.unsplash.com/photo-1508747703725-719777637510?w=800", new String[]{"VietGAP"}, null);
        saveProduct("Ớt chuông đỏ", 70000.0, "kg", giaVi, "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/ot_chuong_mau_nao_tot_tac_dung_cua_ot_chuong_voi_suc_khoe1_444dde2273.jpg", new String[]{"Organic"}, null);
        saveProduct("Tỏi cô đơn lý sơn", 150000.0, "kg", giaVi, "https://vcdn1-kinhdoanh.vnecdn.net/2021/04/13/toi-ly-son-1-1618291045.jpg", new String[]{"Specialty"}, "Bestseller");

        // Nhóm Trái cây
        saveProduct("Táo Envy", 180000.0, "kg", traiCay, "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce", new String[]{"Organic"}, "Bestseller");
        saveProduct("Chuối già Nam Mỹ", 35000.0, "kg", traiCay, "https://hoptacxathanhbinh.com/wp-content/uploads/2023/08/2-2.png", new String[]{"Organic"}, null);
        saveProduct("Cam sành", 40000.0, "kg", traiCay, "https://images.unsplash.com/photo-1582979512210-99b6a53386f9", new String[]{"VietGAP"}, null);
        saveProduct("Xoài cát Hòa Lộc", 90000.0, "kg", traiCay, "https://images.unsplash.com/photo-1553279768-865429fa0078", new String[]{"Organic"}, "Bestseller");
        saveProduct("Dâu tây Đà Lạt", 120000.0, "kg", traiCay, "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800", new String[]{"Organic"}, "Superfood");
    }

    private void saveProduct(String name, Double price, String unit, Category cat, String img, String[] tags, String badge) {
        Product p = new Product();
        p.setName(name);
        p.setPrice(BigDecimal.valueOf(price));
        p.setUnit(unit);
        p.setCategory(cat);
        p.setImageUrl(img);
        p.setTags(tags);
        p.setBadge(badge);
        p.setStock(100.0);
        p.setSold(0.0);
        productRepository.save(p);
    }
}
