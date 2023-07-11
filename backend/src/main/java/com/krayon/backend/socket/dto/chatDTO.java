package com.krayon.backend.socket.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class chatDTO {
	private String id;
	private String chat;
}
