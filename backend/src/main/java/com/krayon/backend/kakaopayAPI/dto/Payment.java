package com.krayon.backend.kakaopayAPI.dto;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Data
@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name ="payment")
@Builder
public class Payment {
    @Id
    private String tid;
    private String pod;
    private String pud;
    private String amount;
}