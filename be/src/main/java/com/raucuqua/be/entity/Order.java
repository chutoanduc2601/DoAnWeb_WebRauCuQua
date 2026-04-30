package com.raucuqua.be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String phone;
    private String address;
    private String shippingMethod;
    private String paymentMethod;
    
    private Double subtotal;
    private Double shippingFee;
    private Double discountAmount;
    private Double total;
    
    private String orderCode;
    private String status = "PENDING";
    
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (this.orderCode == null) {
            this.orderCode = "FG-" + (int)(Math.random() * 90000 + 10000);
        }
    }
}
