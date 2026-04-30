package com.raucuqua.be.service;

import com.raucuqua.be.dto.OrderDTO;
import com.raucuqua.be.entity.Order;
import com.raucuqua.be.entity.OrderItem;
import com.raucuqua.be.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

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

        return orderRepository.save(order);
    }

    public List<Order> getOrdersByUser(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
