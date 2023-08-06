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
import java.util.concurrent.TimeUnit;

@Service
@Slf4j

@ServerEndpoint("/api/game/catch")

public class CatchMindSocketChat {
    //이페이지에 접속해있는 유저 세션을 담은 리스트 (Set)
    private static Set<Session> clients = Collections.synchronizedSet(new HashSet<Session>());
    private static Map<String,String> currentWordMap = new HashMap<>();


    private Map<String ,Object > objMap = new HashMap<>();
    private static Session sessionTurn = null;

    //데이터값을 JSON 형태로 변환해주는 클래스 선언
    ConversionJson c = new ConversionJson();
    WordService wordService = new WordService();

    @OnOpen
    public void onOpen(Session session) throws IOException {
        log.info("open session : {}, clients={}", session.toString(), clients);
        Map<String, List<String>> res = session.getRequestParameterMap();
        String name = res.get("name").get(0);
//        String conversion = c.conversion("open",clients,currentWordMap,id,"시스템");
        log.info("시작");
        if(!clients.contains(session)) {
            clients.add(session);
            log.info("session open : {}", session);
        }else{
            log.info("이미 연결된 session");
        }
        log.info("res={}", res);
        log.info(Arrays.toString(clients.toArray()));
        System.out.println("id = " + name);
        String conversion = c.conversion("open",clients,name,"시스템");
        log.info(conversion);
        System.out.println("currentWordMap = " + currentWordMap);




        for( Session s :clients){
            s.getBasicRemote().sendText(conversion);
        }

    }

    @OnMessage(maxMessageSize = 100000)
    public void onMessage(String message, Session session) throws IOException, JSONException, InterruptedException {
        log.info("receive message : {}", message);
        ObjectMapper json = new ObjectMapper();
        Map<String, String> map = json.readValue((String) message, new TypeReference<Map<String, String>>() {
        });

        String name = map.get("name");
        String date = map.get("date");
        //단어제출 받기
        String sendAnswer = map.get("answer");
        //sendAnswer와 wordInfo의 word와 일치하면 유저리스트에서의 다음사람을 그리미로 지정----맞추면 모두 턴을 false하고 리스트에서의 다음사람을 true로 지정해서 순서대로 그리미가 돈다.
        log.info("사용자가 입력한 answer: " + sendAnswer);


        objMap.put("name", name);
        objMap.put("date", date);

        log.info("userList" + Arrays.toString(clients.toArray()));
//        if(sessionTurn != null) log.info("현재 턴:"+ sessionTurn.getRequestParameterMap().get("name").get(0));
        Object[] clientsArray = clients.toArray();
        int index = Arrays.asList(clientsArray).indexOf(session);


        if (map.containsKey("img")) { //입력값이 img 일때

            if (sessionTurn == session) {

                for (Session s : clients) {
                    s.getBasicRemote().sendText(message);
                }

            }
        } else if (map.containsKey("start")) { //게임시작버튼이 눌렸을때
            if (map.get("start").equals("true")) {
                log.info("이건 시작");
                sessionTurn = session;

                Map<String, String> randomWord = new HashMap<>();
                while (true) {
                    randomWord = wordService.randomWord("명사");
                    if(randomWord != null) break;
                }

                currentWordMap.put("word", randomWord.get("word"));
//                currentWordMap.put("definition",randomWord.get("definition"));
                currentWordMap.put("pos", "");
//                System.out.println("startWord = " + startWord);
                objMap.put("word", randomWord.get("word"));
//                objMap.put("definition",randomWord.get("definition"));
                objMap.put("pos", "");

                String user = sessionTurn.getRequestParameterMap().get("name").get(0);
                objMap.put("user",user);



                for (Session s : clients) {
                    objMap.put("turn", false);
                    if (s == sessionTurn) objMap.replace("turn", true);
                    message = c.conversionWord(objMap, true);
                    log.info("---"+message);
                    s.getBasicRemote().sendText(message);
                }
            }
        } else if (map.containsKey("answer")) {//정답입력하면 모두 false 주고 맞춘사람 true줘서 턴돌리기
            if (sendAnswer.equals(currentWordMap.get("word"))) {

                for (int i = 0; i < clients.size(); i++)
                    if ((Session) clientsArray[i] == clientsArray[(index) % clientsArray.length])
                        sessionTurn = (Session) clientsArray[(i) % clientsArray.length];
                    //정답 알림
                    objMap.put("correct",currentWordMap.get("word"));
                    objMap.put("correctName",session.getRequestParameterMap().get("name").get(0));
                    message = c.conversion(objMap);
                    objMap.remove("correct");
                    objMap.remove("correctName");

                    for( Session s :clients){
                        s.getBasicRemote().sendText(message);
                    }
                    //정답 후 다른사용자에게 다른 단어 생성해서 턴 돌리고 시작
                    Map<String, String> randomWord = new HashMap<>();
                    while (true) {
                        randomWord = wordService.randomWord("명사");
                        if(randomWord != null) break;
                    }
                    objMap.put("word", randomWord.get("word"));
                    objMap.put("pos", "");

                    currentWordMap.replace("word", randomWord.get("word"));
                    currentWordMap.replace("pos", "");
                    objMap.put("turn", false);
                    String user = sessionTurn.getRequestParameterMap().get("name").get(0);
                    objMap.put("user",user);
                    log.info("턴");


                for (Session s : clients) {
                    objMap.put("turn", false);
                    if (s == sessionTurn) objMap.replace("turn", true);
                    message = c.conversionWord(objMap, true);
                    log.info("---"+message);
                    s.getBasicRemote().sendText(message);
                }
            } else {//틀렸을때는 그대로 유지
                for (Session s : clients) {
                    objMap.put("turn", false);
                    if (s == sessionTurn) objMap.replace("turn", true);
                    message = c.conversionWord(objMap, false);
                    log.info("---"+message);
                    s.getBasicRemote().sendText(message);
                }

            }

        }

    }


    @OnClose
    public void onClose(Session session) throws IOException {
        log.info("캐치마인드 session close : {}", session);
//        clients.
        Map<String, List<String>> map = session.getRequestParameterMap();
        String id = map.get("name").get(0); //파라미터값
//        String turn = map.get("turn").get(0); //파라미터값

        Object[] clientsArray = clients.toArray(); //접속종료전 세션list
        int index = Arrays.asList(clientsArray).indexOf(session); //접속종료유저의 세션list의 인덱스

        log.error("삭제전"+clientsArray.toString());
        clients.remove(session); //세션list에서 해당유저 삭제
        clientsArray = clients.toArray(); //해당유저가 삭제된 세션list 재호출
        sessionTurn = (Session) clientsArray[(index+1)%clientsArray.length];
        log.error("삭제후"+clientsArray.toString());

        String message = c.conversion("close",clients, currentWordMap, id, "시스템");
        for (Session s : clients) {
            s.getBasicRemote().sendText(message);
        }

        log.info(clients.toString());
        if(clients.size()==0){//세션에 아무도없다면 세션단어 삭제
            currentWordMap.clear();
        }
        else{//나가면 모두 false하고 유저리스트에서 다음사람에서 true줌
            for (Session s : clients) {
                objMap.put("turn", false);
                if (s == sessionTurn) objMap.replace("turn", true);
                message = c.conversionWord(objMap, true);
                log.info("---"+message);
                s.getBasicRemote().sendText(message);
            }
        }



    }
//    @OnError
    public void onError(Session session, Throwable thr) {
        log.info("소켓에러");
    }
}