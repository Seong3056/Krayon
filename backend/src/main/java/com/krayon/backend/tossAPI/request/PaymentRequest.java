package com.krayon.backend.tossAPI.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequest {
    private String orderId;
    private String orderName;
    private String customerName;
    private String customerEmail;
}
