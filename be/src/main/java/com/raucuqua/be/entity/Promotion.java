package com.raucuqua.be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "promotions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    private String name;
    private String description;

    @Column(nullable = false)
    private String type; // PERCENT, FIXED

    @Column(nullable = false)
    private Double value;

    private Double minOrderAmount = 0.0;
    
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private Integer maxUsage;
    private Integer usageCount = 0;

    private String status = "ACTIVE"; // ACTIVE, INACTIVE

    private String imageUrl; // URL cho poster khuyến mãi

    private String category = "DISCOUNT"; // SHIP, DISCOUNT, COMBO

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
