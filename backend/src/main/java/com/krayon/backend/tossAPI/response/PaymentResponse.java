package com.krayon.backend.tossAPI.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentResponse {
    private boolean success;
    private String message;
}
