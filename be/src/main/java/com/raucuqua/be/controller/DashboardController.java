package com.raucuqua.be.controller;

import com.raucuqua.be.entity.Order;
import com.raucuqua.be.entity.Product;
import com.raucuqua.be.repository.OrderRepository;
import com.raucuqua.be.repository.ProductRepository;
import com.raucuqua.be.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();

        // Total Revenue (From DELIVERED orders)
        Double totalRevenue = orderRepository.sumTotalByStatus("DELIVERED");
        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);

        // Orders stats
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByStatus("PENDING");
        stats.put("totalOrders", totalOrders);
        stats.put("pendingOrders", pendingOrders);

        // Products stats
        long totalProducts = productRepository.count();
        stats.put("totalProducts", totalProducts);

        // Customers stats
        long totalCustomers = userRepository.count();
        stats.put("totalCustomers", totalCustomers);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/revenue-chart")
    public ResponseEntity<List<Map<String, Object>>> getRevenueChart() {
        List<Object[]> results = orderRepository.getRevenueLast7Days();
        List<Map<String, Object>> chartData = new ArrayList<>();
        
        for (Object[] row : results) {
            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("date", row[0].toString());
            dataPoint.put("revenue", row[1]);
            chartData.add(dataPoint);
        }
        
        // Results are ordered by date DESC from the query, might need to reverse for the chart
        java.util.Collections.reverse(chartData);
        
        return ResponseEntity.ok(chartData);
    }

    @GetMapping("/recent-orders")
    public ResponseEntity<List<Order>> getRecentOrders() {
        org.springframework.data.domain.Page<Order> page = orderRepository.findAll(
            PageRequest.of(0, 5, Sort.by("createdAt").descending())
        );
        return ResponseEntity.ok(page.getContent());
    }

    @GetMapping("/top-products")
    public ResponseEntity<List<Product>> getTopProducts() {
        org.springframework.data.domain.Page<Product> page = productRepository.findAll(
            PageRequest.of(0, 5, Sort.by("sold").descending())
        );
        return ResponseEntity.ok(page.getContent());
    }
}
