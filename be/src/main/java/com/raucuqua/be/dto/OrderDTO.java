package com.raucuqua.be.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderDTO {
    private String fullName;
    private String phone;
    private String address;
    private String userId;
    private String shippingMethod;
    private String paymentMethod;
    private Double subtotal;
    private Double shippingFee;
    private Double discountAmount;
    private Double total;
    private List<OrderItemDTO> items;

    @Data
    public static class OrderItemDTO {
        private Long id; // This is the product ID from frontend
        private String name;
        private Double price;
        private Integer quantity;
        private String image;
        private String unit;
    }
}
