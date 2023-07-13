package com.krayon.backend.socket;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.*;

@Service
@Slf4j
@ServerEndpoint("/socket/chatt")
public class WebSocketChat {
    private static Set<Session> clients = Collections.synchronizedSet(new HashSet<Session>());

    @OnOpen
    public void onOpen(Session session) throws IOException {
        log.info("open session : {}, clients={}", session.toString(), clients);
        Map<String, List<String>> res = session.getRequestParameterMap();
        session.getId();
        log.info("res={}", res);

        if(!clients.contains(session)) {
            clients.add(session);
            log.info("session open : {}", session);
        }else{
            log.info("이미 연결된 session");
        }
        for( Session s :clients){
            s.getBasicRemote().sendText("{\"name\":\"\",\"msg\":\"님이 접속했습니다.\",\"date\":\"시스템\"}");
        }
    }

    @OnMessage
    public void onMessage(String message, Session session) throws IOException {
        log.info("receive message : {}", message);

        for (Session s : clients) {
            log.info("send data : {}", message);
            s.getBasicRemote().sendText((String) message);
        }
    }



    @OnClose
    public void onClose(Session session) {
        log.info("session close : {}", session);
//        clients.
        clients.remove(session);
        log.info(clients.toString());
        StringBuilder sb = new StringBuilder();
        sb.append("{ ");
        sb.append("name: \"");
        sb.append("session");
        for (Session s : clients) {
//            log.info("send data : {}", session.get);
            try {
                s.getBasicRemote().sendText("{\"name\":\"\",\"msg\":\"님이 접속을 해제했습니다.\",\"date\":\"시스템\"}");
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }
}