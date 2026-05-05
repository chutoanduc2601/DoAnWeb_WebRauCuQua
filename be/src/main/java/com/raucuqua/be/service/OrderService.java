package com.raucuqua.be.service;

import com.raucuqua.be.dto.OrderDTO;
import com.raucuqua.be.entity.Order;
import com.raucuqua.be.entity.OrderItem;
import com.raucuqua.be.repository.OrderRepository;
import com.raucuqua.be.repository.ProfileRepository;
import com.raucuqua.be.entity.Profile;
import com.raucuqua.be.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private PromotionService promotionService;

    @Transactional
    public Order createOrder(OrderDTO orderDTO) {
        Order order = new Order();
        order.setFullName(orderDTO.getFullName());
        order.setPhone(orderDTO.getPhone());
        order.setAddress(orderDTO.getAddress());
        order.setUserId(orderDTO.getUserId());
        order.setShippingMethod(orderDTO.getShippingMethod());
        order.setPaymentMethod(orderDTO.getPaymentMethod());
        order.setSubtotal(orderDTO.getSubtotal());
        order.setShippingFee(orderDTO.getShippingFee());
        order.setDiscountAmount(orderDTO.getDiscountAmount());
        order.setTotal(orderDTO.getTotal());
        order.setPromotionCode(orderDTO.getPromotionCode());

        // Increment promotion usage if code is provided
        if (orderDTO.getPromotionCode() != null && !orderDTO.getPromotionCode().isEmpty()) {
            promotionService.incrementUsage(orderDTO.getPromotionCode());
        }

        order.setItems(orderDTO.getItems().stream().map(itemDTO -> {
            OrderItem item = new OrderItem();
            item.setProductId(itemDTO.getId());
            item.setName(itemDTO.getName());
            item.setPrice(itemDTO.getPrice());
            item.setQuantity(itemDTO.getQuantity());
            item.setImage(itemDTO.getImage());
            item.setUnit(itemDTO.getUnit());
            item.setOrder(order);
            return item;
        }).collect(Collectors.toList()));

        Order savedOrder = orderRepository.save(order);

        // Phát thông báo real-time
        notificationService.broadcast(savedOrder);

        // Tự động cập nhật thông tin vào Profile nếu có userId
        if (order.getUserId() != null && !order.getUserId().isEmpty()) {
            try {
                java.util.UUID userUuid = java.util.UUID.fromString(order.getUserId());
                profileRepository.findById(userUuid).ifPresent(profile -> {
                    profile.setPhone(order.getPhone());
                    profile.setAddress(order.getAddress());
                    profileRepository.save(profile);
                });
            } catch (IllegalArgumentException e) {
                // Bỏ qua nếu userId không phải là một UUID hợp lệ
            }
        }

        return savedOrder;
    }

    public List<Order> getOrdersByUser(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Transactional
    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
