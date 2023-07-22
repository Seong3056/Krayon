package com.krayon.backend.kakaopayAPI.repository;

import com.krayon.backend.kakaopayAPI.dto.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
}