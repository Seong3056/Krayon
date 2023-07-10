package com.krayon.backend.socket.dto;

import lombok.*;
import org.springframework.web.socket.WebSocketSession;

@Getter
@Setter
@ToString

@NoArgsConstructor
@AllArgsConstructor
@Builder

public class RoomDTO {
	private String userID;
	private String roomId;
	private WebSocketSession session;
}
