package com.krayon.backend.socket.api;

import com.krayon.backend.socket.dto.chatDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.logging.SocketHandler;

//@EnableWebSocket
@RestController
@Slf4j
@RequiredArgsConstructor
public class SocketController {

	@PostMapping("api/chat")
	public ResponseEntity<?> chat(@RequestBody chatDTO dto){
		log.info(dto.toString());
		return ResponseEntity.ok().body(dto);
	}
	@GetMapping("/api/chat")
	public void chat() {
//		User
//		CustomUser user = SecurityContextHolder.getContext().getAuthentication().getPrincipal();


		log.info("==================================");
//		log.info("@ChatController, GET Chat / Username : " + user.getUsername());

//		model.addAttribute("userid", user.getUsername());
	}


}
