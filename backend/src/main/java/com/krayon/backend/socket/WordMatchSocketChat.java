package com.krayon.backend.socket;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.krayon.backend.korean.WordService;
import com.krayon.backend.socket.util.ConversionJson;
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
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j

@ServerEndpoint("/api/game/wordmatch")

public class WordMatchSocketChat {
    //이페이지에 접속해있는 유저 세션을 담은 리스트 (Set)
    private static Set<Session> clients = Collections.synchronizedSet(new HashSet<Session>());
    private static Map<String,String> currentWordMap = new HashMap<>();
    private Map<String ,Object > objMap = new HashMap<>();


    //데이터값을 JSON 형태로 변환해주는 클래스 선언
    ConversionJson c = new ConversionJson();
    WordService wordService = new WordService();

    @OnOpen
    public void onOpen(Session session) throws IOException {
        log.info("open session : {}, clients={}", session.toString(), clients);
        Map<String, List<String>> res = session.getRequestParameterMap();
        String id = res.get("id").get(0);
        log.info("시작");

//        log.info(session.getId());
//        log.info(session.getContainer().toString());
//        log.info(session.getOpenSessions().toString());
//        log.info("메세지 핸들러"+session.getMessageHandlers().toString());
//
//
//        log.info(session.getUserProperties().toString());
//        log.info(session.getRequestURI().toString());
//        log.info(session.getPathParameters().toString());
//        log.info(session.getId());
//        log.info(session.getId());
        if(!clients.contains(session)) {
            clients.add(session);
            log.info("session open : {}", session);
        }else{
            log.info("이미 연결된 session");
        }
        log.info("res={}", res);
        log.info(Arrays.toString(clients.toArray()));
        System.out.println("id = " + id);
        String conversion = c.conversion("open",clients,currentWordMap,id,"시스템");





        for( Session s :clients){
            s.getBasicRemote().sendText(conversion);
        }

    }

    @OnMessage
    public void onMessage(String message, Session session) throws IOException, JSONException {
        log.info("receive message : {}", message);
        ObjectMapper json = new ObjectMapper();
        Map<String, String > map = json.readValue((String) message, new TypeReference<Map<String, String>>() {});
        String name = map.get("name");
        String date = map.get("date");
        objMap.put("name",name);
        objMap.put("date",date);
        log.info("userList"+ Arrays.toString(clients.toArray()));
        Object[] clientsArray = clients.toArray();
        int index = Arrays.asList(clientsArray).indexOf(session);

        if (map.containsKey("msg")) { //입력값이 msg 일때

            for (Session s : clients) {
                log.info("send data : {}", message);
                s.getBasicRemote().sendText(message);


            }

        } else if (map.containsKey("char")) { // 입력값이 char일때 char : 모음단위의 문자열
            for (Session s : clients) {
                s.getBasicRemote().sendText(message);
            }
        }
        else if (map.containsKey("word")) { // 입력값이 word일때

            String word = map.get("word");

            log.info(message);
            List<Map<String, String>> result = wordService.findWord(word);


            if(result == null){
                message = c.conversionWord(name,date,false);
            } else{
                String definition = result.get(0).get("definition");
                String pos = result.get(0).get("pos");
                objMap.put("word",word);
                objMap.put("definition",definition);
                objMap.put("pos",pos);
                currentWordMap.clear();
                currentWordMap.put("word",word);
                currentWordMap.put("definition",definition);
                currentWordMap.put("pos",pos);
                message = c.conversionWord(objMap,true);
            }
            for(int i =0;i<clients.size();i++){

                if(result == null){
                    message = c.conversionWord(name,date,false);
                } else{
                    objMap.put("turn",false);
                    log.info("i: "+i+"다음사람:"+(index+1)%clients.size());
                    if(i == (index+1)%clients.size()) objMap.replace("turn",true);
                    message = c.conversionWord(objMap,true);
                }
                ((Session)clientsArray[i]) .getBasicRemote().sendText(message);
            }
        } else if(map.containsKey("start")){
            if(map.get("start").equals("true")){

                    Map<String, String> startWord = wordService.randomWord("명사");
                    objMap.put("word", startWord.get("word"));
                    objMap.put("definition", startWord.get("definition"));
                    objMap.put("pos", "");

                currentWordMap.put("word", startWord.get("word"));
                currentWordMap.put("definition", startWord.get("definition"));
                currentWordMap.put("pos", "");

                    log.info("11111111: {}", objMap.toString());
                    log.info("22222222: " + objMap.get("word"));
//                log.info("33333333: ", currentWordMap.get("word").toString());
//                log.info("44444444: ", startWord.get("word").toString());
//                if(map.get("msg").equals(objMap.get("word"))) {
//                    log.info("정답입니다");
//                }


                for(int i =0;i<clients.size();i++){
                    objMap.put("turn",false);
                    log.info("i: "+i+"다음사람:"+(index+1)%clients.size());
                    if(i == (index)%clients.size()) objMap.replace("turn",true);
                    message = c.conversionWord(objMap,true);
                    ((Session)clientsArray[i]) .getBasicRemote().sendText(message);
                }
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
        String message = c.conversion("close",clients, currentWordMap, id, "시스템");

        for (Session s : clients) {
//            log.info("send data : {}", session.get);

            try {
                s.getBasicRemote().sendText(message);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }
//    @OnError
    public void onError(Session session, Throwable thr) {
        log.info("소켓에러");
    }




}

