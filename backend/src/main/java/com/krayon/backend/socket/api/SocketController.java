package com.krayon.backend.socket.api;

import com.krayon.backend.socket.dto.chatDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.config.annotation.EnableWebSocket;

//@EnableWebSocket
@RestController
@Slf4j

public class SocketController {
	@PostMapping("api/chat")
	public ResponseEntity<?> chat(@RequestBody chatDTO dto){
		log.info(dto.toString());
		return ResponseEntity.ok().body(dto);
	}
}
