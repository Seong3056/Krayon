package com.krayon.backend.socket.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.regex.Pattern;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class chatDTO {
	private String id;
	private MessageType chat;
	private String time = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm"));

}
