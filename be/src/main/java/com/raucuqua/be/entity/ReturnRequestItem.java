package com.raucuqua.be.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "return_request_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReturnRequestItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "return_request_id")
    @JsonIgnore
    private ReturnRequest returnRequest;

    private Long orderItemId;
    private String productName;
    private Double quantity;
    private Double price;
}
