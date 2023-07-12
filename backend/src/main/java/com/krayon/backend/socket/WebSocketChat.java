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
    public void onOpen(Session session) {
        log.info("open session : {}, clients={}", session.toString(), clients);
        Map<String, List<String>> res = session.getRequestParameterMap();
        log.info("res={}", res);

        if(!clients.contains(session)) {
            clients.add(session);
            log.info("session open : {}", session);
        }else{
            log.info("이미 연결된 session");
        }
    }

    @OnMessage
    public void onMessage(String message, Session session) throws IOException {
        log.info("receive message : {}", message);

        for (Session s : clients) {
            log.info("send data : {}", message);
            s.getBasicRemote().sendText(message);
        }
    }



    @OnClose
    public void onClose(Session session) {
        log.info("session close : {}", session);
//        clients.
        clients.remove(session);
        for (Session s : clients) {
//            log.info("send data : {}", session.get);
            try {
                s.getBasicRemote().sendText("{\"name\":\"ㅁㄴㅇㄻㄴㅇㄹ\",\"msg\":\"ㅁㄴㅇㄻㄴㅇㄹ\",\"date\":\"2023. 7. 11. 오후 5:43:46\"}");
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }
}