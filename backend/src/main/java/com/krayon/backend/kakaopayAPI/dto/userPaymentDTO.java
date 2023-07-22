package com.krayon.backend.kakaopayAPI.dto;

import lombok.*;

@Getter @Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class userPaymentDTO {
	private String id;
	private String itemName;
	private String amount;
}
