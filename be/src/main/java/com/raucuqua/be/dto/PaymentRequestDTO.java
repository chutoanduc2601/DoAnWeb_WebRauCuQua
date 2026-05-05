package com.raucuqua.be.dto;

import lombok.Data;

@Data
public class PaymentRequestDTO {
    private Long orderId;
    private String paymentMethod; // "MOMO" or "PAYOS"
}
