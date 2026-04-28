package com.raucuqua.be.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private BigDecimal price;
    private String unit;
    private String category;

    @Column(name = "image_url")
    private String imageUrl;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "tags")
    private String[] tags;

    private String badge;

    private Integer stock = 0;
    private Integer sold = 0;
    private String status = "active";
}
