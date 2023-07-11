package com.krayon.backend.socket.config;


import com.krayon.backend.socket.dto.RoomDTO;
import com.krayon.backend.socket.dto.chatDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.socket.sockjs.client.WebSocketClientSockJsSession;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
public class SocketHandler extends TextWebSocketHandler {
//	private final List<Map<String , WebSocketSession>> sessions = new ArrayList<>();
//	private final Map<String, WebSocketSession> sessionInfo = new HashMap<>();

//	private final List<RoomDTO> sessions = new ArrayList<>();
	private static final Map<String,Object> sessions = new HashMap<>();
	//웹소켓 연결
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws IOException {
//		var sessionId = session.getId();
//		sessions.put(sessionId,session);
//		chatDTO dto = chatDTO.builder().id(sessionId).receiver("all").build();
//		dto.newConnect();
//
//		sessions.values().forEach(s ->{
////			if(!s.getId().equals(sessionId)) s.sendMessage();
//		});
//		String message = session.toString();
		String uri = String.valueOf(session.getUri());
		String roomId = uri.substring(uri.lastIndexOf("/")+1,uri.lastIndexOf("?"));
		log.info(session.toString());
		log.info(roomId);
//		String id = session.getId();
		String id = uri.substring(uri.lastIndexOf("?")+1);


		RoomDTO sessionRoom = RoomDTO.builder().userID(id).roomId(roomId).session(session).build();
		sessions.put(session.getId(),sessionRoom);



		log.info(sessions.toString());
		sessions.forEach((key,value) -> {
			log.warn(key+ "     "+value.toString());
//			log.error(String.valueOf(!session.getId().equals(key)));
			if(!session.getId().equals(key) && ((RoomDTO) value).getRoomId().equals(roomId)){
				try {
					((RoomDTO) value).getSession().sendMessage(new TextMessage(session.getId()+"님 입장하십니다~"));
				} catch (IOException e) {
					throw new RuntimeException(e);
				}
			}
		});


	}

	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		String uri = String.valueOf(session.getUri());
		String id = uri.substring(uri.lastIndexOf("?")+1);
		String room = uri.substring(uri.lastIndexOf("/")+1,uri.lastIndexOf("?"));
		log.info(message.getPayload());
		sessions.forEach((key,value)->{
			if( ((RoomDTO) value).getRoomId().equals(room)){
				try {
					((RoomDTO) value).getSession().sendMessage(message);
				} catch (IOException e) {
					throw new RuntimeException(e);
				}
			}
		});
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {



 log.info(session.toString());

 log.info(sessions.toString());
 log.info(session.getId());
		String uri = String.valueOf(session.getUri());
		String id = uri.substring(uri.lastIndexOf("?")+1);
		RoomDTO room = RoomDTO.builder().session(session).userID(id).build();
		sessions.remove(session.getId());

		log.info("삭제후 sessions "+sessions.toString());
//		String sessionId = session.getId();
//		RoomDTO room = RoomDTO.builder().userID(sessionId).build();
//		for (RoomDTO s : sessions) {
//			s.getSession().sendMessage(new TextMessage(s.getUserID() + "님이 접속을 종료했습니다."));
//		}

	}

	@Override
	public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
		super.handleTransportError(session, exception);
	}
}

