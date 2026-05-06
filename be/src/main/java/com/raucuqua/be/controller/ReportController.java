package com.raucuqua.be.controller;

import com.raucuqua.be.repository.OrderRepository;
import com.raucuqua.be.repository.ProductRepository;
import com.raucuqua.be.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getReportSummary() {
        Map<String, Object> summary = new HashMap<>();
        
        summary.put("totalRevenue", orderRepository.sumTotalAll() != null ? orderRepository.sumTotalAll() : 0.0);
        summary.put("deliveredRevenue", orderRepository.sumTotalByStatus("DELIVERED") != null ? orderRepository.sumTotalByStatus("DELIVERED") : 0.0);
        summary.put("totalOrders", orderRepository.count());
        summary.put("completedOrders", orderRepository.countByStatus("DELIVERED"));
        summary.put("cancelledOrders", orderRepository.countByStatus("CANCELLED"));
        
        return ResponseEntity.ok(summary);
    }
}
