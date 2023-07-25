package com.krayon.backend.socket;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.krayon.backend.korean.WordService;
import com.krayon.backend.socket.util.ConversionJson;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONException;
import org.springframework.stereotype.Service;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.*;

@Service
@Slf4j

@ServerEndpoint("/api/game/followword")

public class FollowWordSocket {
    //이페이지에 접속해있는 유저 세션을 담은 리스트 (Set)
    private static Set<Session> clients = Collections.synchronizedSet(new HashSet<Session>());
    private static Map<String,String> currentWordMap = new HashMap<>();
    private static HashSet<String > correct = new HashSet<>();
    private static List<Session> correctList = new ArrayList<>();


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
        log.info("시작");
        objMap.put("name",name);
        objMap.put("date","시스템");
        objMap.put("msg",name+"님이 접속했습니다.");
        objMap.put("wordInfo",currentWordMap);
        objMap.put("list",clients);
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
    public void onMessage(String message, Session session) throws IOException, JSONException {
        log.info("receive message : {}", message);
        ObjectMapper json = new ObjectMapper();
        Map<String, String > map = json.readValue((String) message, new TypeReference<Map<String, String>>() {});

        String name = map.get("name");
        String date = map.get("date");
        String msg = map.get("msg");

        objMap.put("name",name);
        objMap.put("date",date);

        log.info("userList"+ Arrays.toString(clients.toArray()));
//        if(sessionTurn != null) log.info("현재 턴:"+sessionTurn.getRequestParameterMap().get("name").get(0) );
        Object[] clientsArray = clients.toArray();
        int index = Arrays.asList(clientsArray).indexOf(session);


        if (map.containsKey("msg")) { //입력값이 msg 일때
            log.info("메세지엔 접근했는데");
            if(sessionTurn == session) {
                log.info("메세지엔 접근했는데");
                log.info(map.get("msg"));
                List<Map<String, String>> result = wordService.findWord(map.get("msg"));
                if(result == null){
                    for(int i =0;i<clients.size();i++){
                        objMap.put("word",currentWordMap.get("word"));
                        objMap.put("definition",currentWordMap.get("definition"));
                        objMap.put("pos",currentWordMap.get("pos"));
                        objMap.put("msg",msg);
                        objMap.put("turn",false);

                        if((Session)clientsArray[i] == clientsArray[(index+1)%clientsArray.length]) {
                            sessionTurn = (Session) clientsArray[(i)%clientsArray.length];
                            objMap.replace("turn",true);

                        }
                        String user = sessionTurn.getRequestParameterMap().get("name").get(0);
                        objMap.put("user",user);
                        message=c.conversionWord(objMap, true);
                        log.info("session:{} send data : {}",clientsArray[i], message);
                        ((Session)clientsArray[i]).getBasicRemote().sendText(message);
                    }
                    return;
                }
                else if(correct.contains(msg)){
                    objMap.put("word",currentWordMap.get("word"));
                    objMap.put("definition",currentWordMap.get("definition"));
                    objMap.put("pos",currentWordMap.get("pos"));
                    objMap.put("msg",msg);
                    objMap.put("turn",false);
                    for(int i =0;i<clients.size();i++) {
                        if ((Session) clientsArray[i] == clientsArray[(index + 1) % clientsArray.length]) {
                            sessionTurn = (Session) clientsArray[(i) % clientsArray.length];
                            objMap.replace("turn", true);

                        }
                    }
                    String user = sessionTurn.getRequestParameterMap().get("name").get(0);
                    objMap.put("user",user);
                    message=c.conversionWord(objMap, false);
                    for (Session s : clients) {
                        log.info("send data : {}", message);
                        s.getBasicRemote().sendText(message);
                    }
                    return;
                } else {
                    String word = map.get("msg");
                    String definition = result.get(0).get("definition");
                    String pos = result.get(0).get("pos");
                    objMap.put("word",word);
                    objMap.put("definition",definition);
                    objMap.put("pos",pos);
                    objMap.put("msg",word);

                    currentWordMap.replace("word",word);
                    currentWordMap.replace("definition",definition);
                    currentWordMap.replace("pos",pos);


                    correct.add(word);
                    correctList.add(session);
                    int frequency = Collections.frequency(correctList, session);

                    objMap.put("turn",false);

                    if(correct.size() > 4){
                        List<Map<String,String>> finish = new ArrayList<>();

                        Map<String,Object> resultMap = new HashMap<>();

                        for (Session s : clients) {
                            if(correctList.contains(s)){
                                Map<String,String> finishSession = new HashMap<>();
                                String name1 = s.getRequestParameterMap().get("name").get(0);
                                String count = String.valueOf(Collections.frequency(correctList, session));
                                finishSession.put("name",name1);
                                finishSession.put("count",count);
                                finish.add(finishSession);
                                resultMap.put("result",finish);

                            }

                            message = c.conversion(resultMap);

                            log.warn(resultMap.toString());
                            s.getBasicRemote().sendText(message);
                        }
                        correctList.clear();
                        correct.clear();
                        currentWordMap.clear();
                        return;
                    }

                }
              for(int i =0;i<clients.size();i++){
                  if((Session)clientsArray[i] == clientsArray[(index+1)%clientsArray.length]) {
                      sessionTurn = (Session) clientsArray[(i)%clientsArray.length];
                      objMap.replace("turn",true);
                  }
              }
                for (Session s : clients) {
                    String user = sessionTurn.getRequestParameterMap().get("name").get(0);
                    objMap.put("user",user);
                    message=c.conversionWord(objMap, true);

                    s.getBasicRemote().sendText(message);
                }

            } else {
                for (Session s : clients) {
                    s.getBasicRemote().sendText(message);
                }
            }
        } else if (map.containsKey("char")) { // 입력값이 char일때 char : 모음단위의 문자열
            if(sessionTurn == session) {
            for (Session s : clients) {
                s.getBasicRemote().sendText(message);
            }}
        } else if(map.containsKey("start")){ //게임시작버튼이 눌렸을때
            if(map.get("start").equals("true")){
                sessionTurn = session;
                Map<String, String> randomWord = new HashMap<>();

                while (true) {
                    randomWord = wordService.randomWord("명사");
                    if(randomWord != null) break;
                }
                objMap.put("word",randomWord.get("word"));
                objMap.put("definition",randomWord.get("definition"));
                objMap.put("pos","");
//                objMap.put("word",randomWord.get("word"));
                currentWordMap.put("word",randomWord.get("word"));
                currentWordMap.put("definition",randomWord.get("definition"));
                currentWordMap.put("pos","");


                
                for (Session s : clients) {
                    objMap.put("turn",false);
                    if(s == sessionTurn) objMap.replace("turn",true);
                    String user = sessionTurn.getRequestParameterMap().get("name").get(0);
                    objMap.put("user",user);
                    message = c.conversionWord(objMap,true);
                    log.info(message);
                    s.getBasicRemote().sendText(message);
                }
            }
        }
    }




    @OnClose
    public void onClose(Session session) throws IOException {
        log.info("끝말잇기 session close : {}", session);
//        clients.
        Map<String, List<String>> map = session.getRequestParameterMap();
        String id = map.get("name").get(0); //파라미터값
//        String turn = map.get("turn").get(0); //파라미터값

        Object[] clientsArray = clients.toArray(); //접속종료전 세션list

        int index = Arrays.asList(clientsArray).indexOf(session); //접속종료유저의 세션list의 인덱스

        System.out.println("clientsArray = " + clientsArray.length);
        System.out.println("index = " + index);
        log.error("삭제전"+clientsArray.toString());
        clients.remove(session); //세션list에서 해당유저 삭제


        log.info(clients.toString());
        if(clients.size()==0){//세션에 아무도없다면 세션단어 삭제
            currentWordMap.clear();
            correct.clear();
        } else {
            clientsArray = clients.toArray(); //해당유저가 삭제된 세션list 재호출
            sessionTurn = (Session) clientsArray[(index+1)%clientsArray.length];
            log.error("삭제후"+clientsArray.toString());
        }
        String message = c.conversion("close",clients, currentWordMap, id, "시스템");
        for (Session s : clients) {
            s.getBasicRemote().sendText(message);
        }
    }
//    @OnError
    public void onError(Session session, Throwable thr) {
        log.info("소켓에러");
    }
}