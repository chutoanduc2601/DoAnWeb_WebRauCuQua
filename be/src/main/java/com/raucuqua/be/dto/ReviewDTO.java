package com.raucuqua.be.dto;

import lombok.Data;

@Data
public class ReviewDTO {
    private Long productId;
    private String userId;
    private String userName;
    private Integer rating;
    private String comment;
}
