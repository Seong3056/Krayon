package com.krayon.backend.socket;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@ServerEndpoint("/api/game/wm")

public class WMSocket {
    private static Set<Session> clients = Collections.synchronizedSet(new HashSet<Session>());
    private static Map<String,String> currentWordMap = new HashMap<>();
    private static List<Map<String, Integer>> controll = new ArrayList<>();

    private Map<String ,Object > objMap = new HashMap<>();
    private int point = 30;

    WordService wordService = new WordService();
    ConversionJson c = new ConversionJson();

    @OnOpen
    public void onOpen(Session session) throws IOException {

        log.info("open session : {}, clients={}", session.toString(), clients);
        Map<String, List<String>> res = session.getRequestParameterMap();
        String name = res.get("name").get(0);
        log.info("시작");
        objMap.put("name",name);
        objMap.put("date","시스템");
        objMap.put("msg",name+"님이 접속했습니다.");
        objMap.put("definition",currentWordMap.get("definition") != null ? currentWordMap.get("definition"): "");
        objMap.put("word",currentWordMap.get("word") != null ? currentWordMap.get("word"): "");


        log.info("res={}", res);


        if(!clients.contains(session)) {
            clients.add(session);
            log.info("WM session open : {}", session);
        }else{
            log.info("이미 연결된 session");
        }
        objMap.put("list",clients);
        log.info("res={}", res);
        log.info(Arrays.toString(clients.toArray()));
        System.out.println("id = " + name);


//        String conversion = c.conversion("open",clients,currentWordMap,name,"시스템");
        String conversion = c.conversion(objMap);
//        log.info(asd);
        log.info(conversion);
        System.out.println("currentWordMap = " + currentWordMap);




        for( Session s :clients){
            s.getBasicRemote().sendText(conversion);
        }

    }

    @OnMessage
    public void onMessage(String message, Session session) throws IOException, InterruptedException {
        objMap.clear();
        log.info("receive message : {}", message);
        ObjectMapper json = new ObjectMapper();
        Map<String, String > map = json.readValue((String) message, new TypeReference<Map<String, String>>() {});
        String name = map.get("name");
        String msg = map.get("msg");
        String date = map.get("date");
        String word = "";

        objMap.put("name",name);
        objMap.put("msg",msg);
        objMap.put("date",date);
        //{name: , msg: , date: }
        if (map.containsKey("msg")){

            if(msg.equals(currentWordMap.get("word"))){
                for (Session s : clients) {
                    objMap.put("answer",msg);
                    message = c.conversion(objMap);
                    log.info("send data : {}", message);
                    s.getBasicRemote().sendText(message);
                }
                objMap.remove("answer");
                Map<String, String> randomWord = new HashMap<>();
                while (true) {
                    randomWord = wordService.randomWord("명사");
                    if(randomWord != null) break;
                }

                objMap.put("word",randomWord.get("word"));
                objMap.put("definition",randomWord.get("definition"));
                objMap.remove("msg");
                //게임시작눌렀을때 {name: , date: , definition: , start: }

                currentWordMap.put("word",randomWord.get("word"));
                currentWordMap.put("definition",randomWord.get("definition"));
                message = c.conversion(objMap);
                TimeUnit.SECONDS.sleep(3);
                for (Session s : clients) {
                    log.info("send data : {}", message);
                    s.getBasicRemote().sendText(message);
                }
            }
            for (Session s : clients) {
                log.info("send data : {}", message);
                s.getBasicRemote().sendText(message);
            }
        }
        else if(map.get("start").equals("true")){//게임시작이 눌렸을때
            Map<String, String> currentWord = wordService.randomWord("명사");
            Map<String, String> randomWord = new HashMap<>();
            while (true) {
                randomWord = wordService.randomWord("명사");
                if(randomWord != null) break;
            }
            objMap.put("word",randomWord.get("word"));
            objMap.put("definition",randomWord.get("definition"));
            objMap.put("start",true);
            objMap.remove("msg");
            //게임시작눌렀을때 {name: , date: , definition: , start: }

            currentWordMap.put("word",randomWord.get("word"));
            currentWordMap.put("definition",randomWord.get("definition"));
            message = c.conversion(objMap);
            for (Session s : clients) {
                log.info("send data : {}", message);
                s.getBasicRemote().sendText(message);
            }

        }
//        for (Session s : clients) {
//            log.info("send data : {}", message);
//            s.getBasicRemote().sendText(message);
//        }
    }

    @OnClose
    public void onClose(Session session) {
        log.info("session close : {}", session);
//        clients.
        clients.remove(session);
        Map<String, List<String>> res = session.getRequestParameterMap();
        String name = res.get("name").get(0);
        objMap.put("name",name);
        objMap.put("date","시스템");
        objMap.put("msg",name+"님이 나갔습니다.");
        for (Session s : clients) {
//            log.info("send data : {}", session.get);

            try {
                String message = c.conversion(objMap);

                s.getBasicRemote().sendText(message);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }
}