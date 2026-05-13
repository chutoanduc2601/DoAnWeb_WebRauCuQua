package com.raucuqua.be.dto;

import lombok.Data;

@Data
public class ReturnRequestItemDTO {
    private Long orderItemId;
    private String productName;
    private Double quantity;
    private Double price;
}
