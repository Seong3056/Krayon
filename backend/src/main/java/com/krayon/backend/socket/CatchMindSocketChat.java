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

@Service
@Slf4j

@ServerEndpoint("/api/game/catch")

public class CatchMindSocketChat {
    //이페이지에 접속해있는 유저 세션을 담은 리스트 (Set)
    private static Set<Session> clients = Collections.synchronizedSet(new HashSet<Session>());
    private static Map<String,String> currentWordMap = new HashMap<>();
    private static HashSet<String> correct = new HashSet<>();

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
        String conversion = c.conversion("open",clients,name,"시스템");
        log.info(conversion);
        System.out.println("currentWordMap = " + currentWordMap);




        for( Session s :clients){
            s.getBasicRemote().sendText(conversion);
        }

    }

    @OnMessage(maxMessageSize = 100000)
    public void onMessage(String message, Session session) throws IOException, JSONException {
        log.info("receive message : {}", message);
        ObjectMapper json = new ObjectMapper();
        Map<String, String > map = json.readValue((String) message, new TypeReference<Map<String, String>>() {});

        String name = map.get("name");
        String date = map.get("date");

        objMap.put("name",name);
        objMap.put("date",date);

        log.info("userList"+ Arrays.toString(clients.toArray()));
        if(sessionTurn != null) log.info("현재 턴:"+ sessionTurn.getRequestParameterMap().get("name").get(0));
        Object[] clientsArray = clients.toArray();
        int index = Arrays.asList(clientsArray).indexOf(session);


        if (map.containsKey("img")) { //입력값이 msg 일때
            log.info("메세지엔 접근했는데");
            if(sessionTurn == session) {

                    for (Session s : clients) {
                        s.getBasicRemote().sendText(message);
                    }
        }
            else {
                for (Session s : clients) {
                    s.getBasicRemote().sendText(message);
                }}
            }
        else if (map.containsKey("word")) { // 입력값이 word일때

            String word = map.get("word");
            log.info(message);
            List<Map<String, String>> result = wordService.findWord(word);

            if(result == null){
                message = c.conversionWord(name,date,false);
            } else{
//                String definition = result.get(0).get("definition");
                String pos = result.get(0).get("pos");
                //여기서 obj에 값 put
                objMap.put("word",word);
                objMap.put("pos",pos);

                currentWordMap.replace("word",word);
                currentWordMap.replace("pos",pos);
                System.out.println("currentWordMap = " + currentWordMap);
                message = c.conversionWord(objMap,true);
            }
            for(int i =0;i<clients.size();i++){
                objMap.put("turn",false);
                log.info("i: "+i+"다음사람:"+(index+1)%clients.size());
                if(i == (index+1)%clients.size()) objMap.replace("turn",true);
                message = c.conversionWord(objMap,true);

                log.info(i+"번째 "+ message);
                ((Session)clientsArray[i]) .getBasicRemote().sendText(message);
            }
        } else if(map.containsKey("start")){ //게임시작버튼이 눌렸을때
            if(map.get("start").equals("true")){
                sessionTurn = session;
                Map<String, String> randomWord = wordService.randomWord("명사");
                objMap.put("word",randomWord.get("word"));
//                objMap.put("definition",randomWord.get("definition"));
                objMap.put("pos","");

                currentWordMap.put("word",randomWord.get("word"));
//                currentWordMap.put("definition",randomWord.get("definition"));
                currentWordMap.put("pos","");
//                System.out.println("startWord = " + startWord);


                for (Session s : clients) {
                    objMap.put("turn",false);
                    if(s == sessionTurn) objMap.replace("turn",true);
                    message = c.conversionWord(objMap,true);
                    log.info(message);
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
        int index = (Arrays.asList(clientsArray).indexOf(session) + 1)%clientsArray.length; //접속종료유저의 세션list의 인덱스

        log.error("삭제전"+clientsArray.toString());
        clients.remove(session); //세션list에서 해당유저 삭제
        clientsArray = clients.toArray(); //해당유저가 삭제된 세션list 재호출
        sessionTurn = (Session) clientsArray[index];
        log.error("삭제후"+clientsArray.toString());

        log.info(clients.toString());
        if(clients.size()==0){//세션에 아무도없다면 세션단어 삭제
            currentWordMap.clear();
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