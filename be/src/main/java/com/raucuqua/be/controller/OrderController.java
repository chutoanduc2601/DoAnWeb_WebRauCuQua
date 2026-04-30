package com.raucuqua.be.controller;

import com.raucuqua.be.dto.OrderDTO;
import com.raucuqua.be.entity.Order;
import com.raucuqua.be.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderDTO orderDTO) {
        Order savedOrder = orderService.createOrder(orderDTO);
        return ResponseEntity.ok(savedOrder);
    }
}
