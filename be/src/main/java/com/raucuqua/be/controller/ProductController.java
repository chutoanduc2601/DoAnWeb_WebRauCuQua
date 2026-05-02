package com.raucuqua.be.controller;

import com.raucuqua.be.entity.Product;
import com.raucuqua.be.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getAllProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        
        return productRepository.findByFilters(name, categoryId, minPrice, maxPrice);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        return product.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Optional<Product> productOptional = productRepository.findById(id);
        if (productOptional.isPresent()) {
            Product product = productOptional.get();
            product.setName(productDetails.getName());
            product.setPrice(productDetails.getPrice());
            product.setUnit(productDetails.getUnit());
            product.setCategory(productDetails.getCategory());
            product.setImageUrl(productDetails.getImageUrl());
            product.setTags(productDetails.getTags());
            product.setBadge(productDetails.getBadge());
            product.setStock(productDetails.getStock() != null ? productDetails.getStock() : 0);
            product.setSold(productDetails.getSold() != null ? productDetails.getSold() : 0);
            product.setStatus(productDetails.getStatus() != null ? productDetails.getStatus() : "active");
            return ResponseEntity.ok(productRepository.save(product));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Autowired
    private com.raucuqua.be.repository.CategoryRepository categoryRepository;

    @GetMapping("/fix-categories")
    public String fixCategories() {
        List<com.raucuqua.be.entity.Category> cats = categoryRepository.findAll();
        com.raucuqua.be.entity.Category rau = cats.stream().filter(c -> c.getName().toLowerCase().contains("rau")).findFirst().orElse(null);
        com.raucuqua.be.entity.Category cu = cats.stream().filter(c -> c.getName().toLowerCase().contains("củ") || c.getName().toLowerCase().contains("cu")).findFirst().orElse(null);
        com.raucuqua.be.entity.Category trai = cats.stream().filter(c -> c.getName().toLowerCase().contains("trái")).findFirst().orElse(null);
        com.raucuqua.be.entity.Category gia = cats.stream().filter(c -> c.getName().toLowerCase().contains("gia")).findFirst().orElse(null);

        List<Product> products = productRepository.findAll();
        for (Product p : products) {
            String name = p.getName().toLowerCase();
            if (name.contains("súp lơ") || name.contains("rau") || name.contains("cải") || name.contains("xà lách") || name.contains("hành") || name.contains("măng tây")) {
                p.setCategory(rau);
            } else if (name.contains("cà rốt") || name.contains("khoai") || name.contains("dền") || name.contains("su su") || name.contains("củ") || name.contains("mướp") || name.contains("khổ qua") || name.contains("nấm")) {
                p.setCategory(cu);
            } else if (name.contains("tỏi") || name.contains("ớt")) {
                p.setCategory(gia);
            } else {
                p.setCategory(trai); // Táo, chuối, cam, xoài...
            }
        }
        productRepository.saveAll(products);
        return "Fixed categories for " + products.size() + " products.";
    }
}
