package com.krayon.backend.socket.config;


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
			if(!s.getId().equals(sessionId)) s.sendMessage(new);
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

