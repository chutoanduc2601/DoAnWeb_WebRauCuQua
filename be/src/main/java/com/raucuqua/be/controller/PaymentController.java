package com.raucuqua.be.controller;

import com.raucuqua.be.dto.PaymentRequestDTO;
import com.raucuqua.be.dto.PaymentResponseDTO;
import com.raucuqua.be.payment.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create")
    public ResponseEntity<PaymentResponseDTO> createPayment(@RequestBody PaymentRequestDTO request) {
        try {
            PaymentResponseDTO response = paymentService.createPaymentLink(request.getOrderId(), request.getPaymentMethod());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // IPN Webhook for MoMo
    @PostMapping("/momo/ipn")
    public ResponseEntity<Void> handleMoMoIpn(@RequestBody Map<String, Object> payload) {
        System.out.println("MoMo IPN Received: " + payload);
        // Here you would verify the signature, check resultCode == 0
        // Then update the order status in the database to PAID
        return ResponseEntity.noContent().build();
    }

    // IPN Webhook for PayOS
    @PostMapping("/payos/ipn")
    public ResponseEntity<Map<String, String>> handlePayOsIpn(@RequestBody Map<String, Object> payload) {
        System.out.println("PayOS IPN Received: " + payload);
        // Verify PayOS signature and update order status
        return ResponseEntity.ok(Map.of("success", "true"));
    }
}
