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

    @GetMapping("/revenue-weekly")
    public ResponseEntity<List<Map<String, Object>>> getWeeklyRevenue() {
        List<Object[]> results = orderRepository.getRevenueLast10Weeks();
        List<Map<String, Object>> chartData = new ArrayList<>();
        
        for (Object[] row : results) {
            if (row[0] != null) {
                Map<String, Object> dataPoint = new HashMap<>();
                String weekStart = row[0].toString();
                if (weekStart.length() >= 10) {
                    weekStart = weekStart.substring(0, 10);
                }
                dataPoint.put("week", weekStart);
                dataPoint.put("revenue", row[1] != null ? row[1] : 0.0);
                chartData.add(dataPoint);
            }
        }
        
        java.util.Collections.reverse(chartData);
        return ResponseEntity.ok(chartData);
    }

    @GetMapping("/revenue-monthly")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyRevenue() {
        List<Object[]> results = orderRepository.getRevenueCurrentYearByMonth();
        
        Map<Integer, Double> monthlyData = new HashMap<>();
        for (int i = 1; i <= 12; i++) {
            monthlyData.put(i, 0.0);
        }
        
        for (Object[] row : results) {
            if (row[0] != null && row[1] != null) {
                Number monthNum = (Number) row[0];
                Number revenueNum = (Number) row[1];
                monthlyData.put(monthNum.intValue(), revenueNum.doubleValue());
            }
        }
        
        List<Map<String, Object>> chartData = new ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("month", "T" + i);
            dataPoint.put("revenue", monthlyData.get(i));
            chartData.add(dataPoint);
        }
        
        return ResponseEntity.ok(chartData);
    }

    @GetMapping("/revenue-yearly")
    public ResponseEntity<List<Map<String, Object>>> getYearlyRevenue() {
        List<Object[]> results = orderRepository.getRevenueByYear();
        
        int currentYear = java.time.Year.now().getValue();
        int startYear = currentYear - 4; // Mặc định hiển thị 5 năm gần nhất nếu không có năm nào cũ hơn
        
        // Tìm năm nhỏ nhất trong DB nếu có dữ liệu để vẽ biểu đồ từ năm đó
        if (!results.isEmpty() && results.get(0)[0] != null) {
            Number firstYearNum = (Number) results.get(0)[0];
            int dbStartYear = firstYearNum.intValue();
            if (dbStartYear < startYear) {
                startYear = dbStartYear;
            }
        }
        
        Map<Integer, Double> yearlyData = new HashMap<>();
        for (int y = startYear; y <= currentYear; y++) {
            yearlyData.put(y, 0.0);
        }
        
        for (Object[] row : results) {
            if (row[0] != null && row[1] != null) {
                Number yearNum = (Number) row[0];
                Number revenueNum = (Number) row[1];
                yearlyData.put(yearNum.intValue(), revenueNum.doubleValue());
            }
        }
        
        List<Map<String, Object>> chartData = new ArrayList<>();
        for (int y = startYear; y <= currentYear; y++) {
            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("year", "Năm " + y);
            dataPoint.put("revenue", yearlyData.get(y));
            chartData.add(dataPoint);
        }
        
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
