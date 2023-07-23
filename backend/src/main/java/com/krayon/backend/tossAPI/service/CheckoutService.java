package com.krayon.backend.tossAPI.service;

import com.krayon.backend.tossAPI.request.PaymentRequest;
import org.springframework.stereotype.Service;

@Service
public class CheckoutService {
    public boolean processPayment(PaymentRequest paymentRequest) {
        return true;
    }
}
