package com.raucuqua.be.controller;

import com.raucuqua.be.entity.Order;
import com.raucuqua.be.repository.OrderRepository;
import com.raucuqua.be.service.OrderService;
import com.raucuqua.be.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private VNPayService vnPayService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/vnpay-callback")
    public ResponseEntity<Map<String, Object>> vnpayCallback(HttpServletRequest request) {
        Map<String, Object> result = new HashMap<>();

        int paymentStatus = vnPayService.orderReturn(request);
        String orderCode = request.getParameter("vnp_TxnRef");
        String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");

        Order order = orderRepository.findByOrderCode(orderCode).orElse(null);

        if (order == null) {
            result.put("status", "error");
            result.put("message", "Không tìm thấy đơn hàng tương ứng");
            return ResponseEntity.badRequest().body(result);
        }

        if (paymentStatus == 1) {
            // Update order status to CONFIRMED
            orderService.updateOrderStatus(order.getId(), "CONFIRMED", "Thanh toán thành công qua VNPAY. Mã GD: " + request.getParameter("vnp_TransactionNo"));
            result.put("status", "success");
            result.put("message", "Thanh toán thành công");
            result.put("orderCode", orderCode);
            result.put("total", order.getTotal());
        } else if (paymentStatus == 0) {
            // Update order status to CANCELLED
            orderService.updateOrderStatus(order.getId(), "CANCELLED", "Thanh toán thất bại/bị hủy qua VNPAY. Mã lỗi: " + vnp_ResponseCode);
            result.put("status", "failed");
            result.put("message", "Thanh toán thất bại hoặc bị hủy bỏ");
            result.put("orderCode", orderCode);
        } else {
            result.put("status", "error");
            result.put("message", "Chữ ký không hợp lệ (Signature verification failed)");
        }

        return ResponseEntity.ok(result);
    }
}
