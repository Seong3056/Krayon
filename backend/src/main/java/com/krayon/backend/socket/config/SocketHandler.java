package com.krayon.backend.socket.config;


import com.krayon.backend.socket.dto.chatDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
public class SocketHandler extends TextWebSocketHandler {
	private final Map<String , WebSocketSession> sessions = new ConcurrentHashMap<>();

	//웹소켓 연결
	@Override
	public void afterConnectionEstablished(WebSocketSession session){
		var sessionId = session.getId();
		sessions.put(sessionId,session);
		chatDTO dto = chatDTO.builder().id(sessionId).receiver("all").build();
		dto.newConnect();

		sessions.values().forEach(s ->{
//			if(!s.getId().equals(sessionId)) s.sendMessage();
		});
	}

	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		super.handleTextMessage(session, message);
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		super.afterConnectionClosed(session, status);
	}

	@Override
	public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
		super.handleTransportError(session, exception);
	}
}

