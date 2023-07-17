package com.krayon.backend.socket;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.krayon.backend.korean.WordService;
import com.krayon.backend.socket.util.ConversionJson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONException;
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

@ServerEndpoint("/api/game/followword")
@RequiredArgsConstructor
public class FollowWordSocketChat {
    //이페이지에 접속해있는 유저 세션을 담은 리스트 (Set)
    private static Set<Session> clients = Collections.synchronizedSet(new HashSet<Session>());

    //데이터값을 JSON 형태로 변환해주는 클래스 선언
    ConversionJson c = new ConversionJson();
    private final WordService wordService;

    @OnOpen
    public void onOpen(Session session) throws IOException {
        log.info("open session : {}, clients={}", session.toString(), clients);
        Map<String, List<String>> res = session.getRequestParameterMap();
        String id = res.get("id").get(0);
        log.info("끝말잇기 소켓on");


        if(!clients.contains(session)) {
            clients.add(session);
            log.info("session open : {}", session);
        }else{
            log.info("이미 연결된 session");
        }
        log.info("res={}", res);
        log.info(Arrays.toString(clients.toArray()));
        System.out.println("id = " + id);
        String conversion = c.conversion("open",clients,id,"시스템");





        for( Session s :clients){
            s.getBasicRemote().sendText(conversion);
        }

    }

    @OnMessage
    public void onMessage(String message, Session session) throws IOException {
        log.info("receive message : {}", message);
        ObjectMapper json = new ObjectMapper();
        Map<String, String> map = json.readValue((String) message, new TypeReference<Map<String, String>>() {
        });


        if (map.containsKey("msg")) {
            for (Session s : clients) {
                log.info("send data : {}", message);
                s.getBasicRemote().sendText(message);

            }
        } else if (map.containsKey("char")) {
            for (Session s : clients) {
                s.getBasicRemote().sendText(message);
            }
        }
    }



    @OnClose
    public void onClose(Session session) {
        log.info("session close : {}", session);
//        clients.
        Map<String, List<String>> map = session.getRequestParameterMap();
        String id = map.get("id").get(0);
        clients.remove(session);
        log.info(clients.toString());
        String message = c.conversion("close",clients, id, "시스템");

        for (Session s : clients) {
//            log.info("send data : {}", session.get);

            try {
                s.getBasicRemote().sendText(message);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }
}