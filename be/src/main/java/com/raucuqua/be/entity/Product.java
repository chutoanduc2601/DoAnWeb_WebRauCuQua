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
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "image_url")
    private String imageUrl;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "tags")
    private String[] tags;

    private String badge;

    private Double stock = 0.0;
    private Double sold = 0.0;
    private String status = "active";
}
