package com.raucuqua.be.controller;

import com.raucuqua.be.dto.OrderDTO;
import com.raucuqua.be.entity.Order;
import com.raucuqua.be.entity.OrderTracking;
import com.raucuqua.be.service.NotificationService;
import com.raucuqua.be.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import com.raucuqua.be.repository.OrderRepository;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private com.raucuqua.be.service.VNPayService vnPayService;

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderDTO orderDTO, jakarta.servlet.http.HttpServletRequest request) {
        Order savedOrder = orderService.createOrder(orderDTO);
        if ("vnpay".equalsIgnoreCase(savedOrder.getPaymentMethod())) {
            // Generate timestamp-based vnpTxnRef (yyyyMMddHHmmss + 4 random digits)
            String timeStamp = new java.text.SimpleDateFormat("yyyyMMddHHmmss").format(new java.util.Date());
            String vnpTxnRef = timeStamp + String.format("%04d", new java.util.Random().nextInt(10000));
            savedOrder.setVnpTxnRef(vnpTxnRef);

            String paymentUrl = vnPayService.createPaymentUrl(savedOrder, request);
            savedOrder.setPaymentUrl(paymentUrl);
            orderRepository.save(savedOrder);
        }
        return ResponseEntity.ok(savedOrder);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getMyOrders(@PathVariable String userId) {
        List<Order> orders = orderService.getOrdersByUser(userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/paged")
    public org.springframework.data.domain.Page<Order> getOrdersPaged(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        org.springframework.data.domain.Pageable pageable = 
            org.springframework.data.domain.PageRequest.of(page, size, org.springframework.data.domain.Sort.by("createdAt").descending());
        
        return orderService.getOrdersPaged(search, status, pageable);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        Order updated = orderService.updateOrderStatus(id, body.get("status"), body.get("description"));
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}/tracking")
    public ResponseEntity<List<OrderTracking>> getOrderTracking(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderTracking(id));
    }

    @GetMapping(value = "/notifications", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe() {
        return notificationService.subscribe();
    }
}
