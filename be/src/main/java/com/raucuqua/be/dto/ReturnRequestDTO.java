package com.raucuqua.be.dto;

import lombok.Data;

import java.util.List;

@Data
public class ReturnRequestDTO {
    private Long orderId;
    private String userId;
    private String reason;
    private String description;
    private List<String> imageUrls;
    private List<ReturnRequestItemDTO> items;
}
