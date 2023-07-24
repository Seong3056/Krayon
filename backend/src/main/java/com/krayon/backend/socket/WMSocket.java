package com.krayon.backend.socket;

import com.krayon.backend.korean.WordService;
import com.krayon.backend.socket.util.ConversionJson;
import lombok.RequiredArgsConstructor;
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
@ServerEndpoint("/api/game/wm")

public class WMSocket {
    private static Set<Session> clients = Collections.synchronizedSet(new HashSet<Session>());
    private Map<String ,Object > objMap = new HashMap<>();
    private static Map<String,String> currentWordMap = new HashMap<>();
    WordService wordService = new WordService();
    ConversionJson c = new ConversionJson();

    @OnOpen
    public void onOpen(Session session) throws IOException {

        log.info("open session : {}, clients={}", session.toString(), clients);
        Map<String, List<String>> res = session.getRequestParameterMap();
        log.info("res={}", res);

        String name = res.get("name").get(0);
        log.info("시작");
        objMap.put("name",name);
        objMap.put("date","시스템");
        objMap.put("msg",name+"님이 접속했습니다.");
        objMap.put("wordInfo",currentWordMap);



        if(!clients.contains(session)) {
            clients.add(session);
            log.info("WM session open : {}", session);
        }else{
            log.info("이미 연결된 session");
        }
        objMap.put("list",clients);
        String message = c.conversion(objMap);
        for (Session s : clients) {
            log.info("send data : {}", message);
            s.getBasicRemote().sendText(message);
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