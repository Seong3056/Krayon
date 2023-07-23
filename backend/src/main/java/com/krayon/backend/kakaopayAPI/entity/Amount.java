package com.krayon.backend.kakaopayAPI.entity;


import lombok.Data;

@Data
public class Amount {
    private Integer total;
    private Integer tax_free_amount;
    private Integer vat_amount;
    private Integer point;
    private Integer discount;
}
