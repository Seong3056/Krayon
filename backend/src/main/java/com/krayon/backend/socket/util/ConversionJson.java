package com.krayon.backend.socket.util;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import javax.websocket.Session;
import java.util.*;


@Slf4j
@Component
public class ConversionJson {
	public String conversion(Map<String,Object> map){
//		log.info(map.toString());
		Set<String> idList = new HashSet<>();
		List<Map<String,Object>> p = new ArrayList<>();
		Set<Session> clients = new HashSet<>();
		if(map.containsKey("point")){
			Object point = map.get("point");
			for (Object o : (List) point) {
				System.out.println("o = " + o);
				Map<String,Object> oMap = (Map<String, Object>) o;
				Map<String,Object> nMap = new HashMap<>();
				nMap.put("name",oMap.get("name"));
				nMap.put("point",oMap.get("point"));

				p.add(nMap);
			}
			System.out.println("p = " + p);
			map.replace("point",p);
		}
		if(map.containsKey("list")) {
			log.info(clients.toString());
			clients = (Set<Session>) map.get("list");
			clients.forEach(a -> {
				String name = a.getRequestParameterMap().get("name").get(0);
				log.error("유저들+"+name);
				idList.add(name);

			});
			map.replace("list",idList);
		}
		log.info(map.toString());
		if(map.containsKey("result")) log.warn("result"+ map.toString());
		ObjectMapper mapper = new ObjectMapper();
		String json = "";
		try {
			json = mapper.writeValueAsString(map);
		} catch (JsonProcessingException e) {
			throw new RuntimeException(e);
		}
		return json;
	}

	public String conversion(String state, Set<Session> clients, Map<String, String> currentWordMap, String ...field){
		Map<String,Object> map = new HashMap<>();
		StringBuilder sb = new StringBuilder();


		//접속중인 유저들을 리스트에 담는다.
		Set<String> idList = new HashSet<>();
//		JSONPObject json = new JSONPObject(idList);
				clients.forEach(a -> {
			 String name = a.getRequestParameterMap().get("name").get(0);
			 log.error("유저들+"+name);
			 idList.add(name);

		 });
		map.put("name",field[0]); //아이디
		map.put("date",field[1]); //날짜
		if(currentWordMap != null)		map.put("wordInfo",currentWordMap);
		map.put("list",idList);
		ObjectMapper mapper = new ObjectMapper();



//		for (Object o : clientsArray){
//			idArray. ((Session) o).getRequestParameterMap().get("id").get(0);
//		}
//		String[] id = ((Session)clientsArray[0]).getRequestParameterMap().get("id").get(0);
//		log.info(((Session)clientsArray[0]).getRequestParameterMap().get("id").get(0));
//
//		log.info("ConversionJson 접근");
//		log.info(Arrays.toString(clientsArray));
//		sb.append("{\"name\" : \"\", \"date\" : \"시스템\" ,\"msg\": \""+ field[0] +"님이 접속했습니다.\"}");
		switch (state){
			case "open":
				map.put("msg",field[0]+"님이 접속했습니다.");
				break;
			case "close":
				map.put("msg",field[0]+"님이 나갔습니다.");
				break;
		}
		String json = "";
		try {
			json = mapper.writeValueAsString(map);
		} catch (JsonProcessingException e) {
			throw new RuntimeException(e);
		}
		log.info(sb.toString());
		return json;
	}
	public String conversionWord (Map<String, Object> objMap, boolean flag){
		Map<String,Object> map = new HashMap<>();

		map.put("name",objMap.get("name"));
		map.put("date",objMap.get("date"));
		if(objMap.containsKey("turn"))map.put("turn",objMap.get("turn"));
		if(objMap.containsKey("user")) map.put("user",objMap.get("user"));
		if(objMap.containsKey("msg")) map.put("msg",objMap.get("msg"));

		Map<String,Object> wordMap = new HashMap<>(); // word 객체 생성
		if(objMap.containsKey("word")) wordMap.put("word",objMap.get("word"));
		if(objMap.containsKey("definition")) wordMap.put("definition",objMap.get("definition"));
		if(objMap.containsKey("pos")) wordMap.put("pos",objMap.get("pos"));


		wordMap.put("isVaild",flag);



		String json = "";
		String inJson = "";
		ObjectMapper mapper = new ObjectMapper();

		try {
			inJson = mapper.writeValueAsString(wordMap);
			map.put("wordInfo",wordMap);
			json = mapper.writeValueAsString(map);
		} catch (JsonProcessingException e) {
			throw new RuntimeException(e);
		}
		log.info("워드서비스의 제이슨ㄴㄴ"+json);
		return json;
	}

	public String conversionWord(String id, String date, boolean flag) {
		Map<String,Object> map = new HashMap<>();

		map.put("name",id);
		map.put("date",date);


		Map<String,Object> wordMap = new HashMap<>(); // word 객체 생성

		wordMap.put("isVaild",flag);



		String json = "";
		String inJson = "";
		ObjectMapper mapper = new ObjectMapper();

		try {
			inJson = mapper.writeValueAsString(wordMap);
			map.put("wordInfo",wordMap);
			json = mapper.writeValueAsString(map);
		} catch (JsonProcessingException e) {
			throw new RuntimeException(e);
		}

		return json;
	}

	public String conversion(String state, Set<Session> clients, String ...field) {
		Map<String,Object> map = new HashMap<>();


		//접속중인 유저들을 리스트에 담는다.
		Set<String> idList = new HashSet<>();
//		JSONPObject json = new JSONPObject(idList);
		clients.forEach(a -> {
			String name = a.getRequestParameterMap().get("name").get(0);
			idList.add(name);

		});
		map.put("name",field[0]); //아이디
		map.put("date",field[1]); //날짜
		map.put("list",idList);
		ObjectMapper mapper = new ObjectMapper();



//		for (Object o : clientsArray){
//			idArray. ((Session) o).getRequestParameterMap().get("id").get(0);
//		}
//		String[] id = ((Session)clientsArray[0]).getRequestParameterMap().get("id").get(0);
//		log.info(((Session)clientsArray[0]).getRequestParameterMap().get("id").get(0));
//
//		log.info("ConversionJson 접근");
//		log.info(Arrays.toString(clientsArray));
//		sb.append("{\"name\" : \"\", \"date\" : \"시스템\" ,\"msg\": \""+ field[0] +"님이 접속했습니다.\"}");
		switch (state){
			case "open":
				map.put("msg",field[0]+"님이 접속했습니다.");
				break;
			case "close":
				map.put("msg",field[0]+"님이 나갔습니다.");
				break;
			case "word":
				map.put("word",field[2]);
				break;
		}
		String json = "";
		try {
			json = mapper.writeValueAsString(map);
		} catch (JsonProcessingException e) {
			throw new RuntimeException(e);
		}

		return json;
	}

	public String conversion(List<Map<String, String>> finish) {
		ObjectMapper mapper = new ObjectMapper();
		String json = "";
		try {
			json = mapper.writeValueAsString(finish);
		} catch (JsonProcessingException e) {
			throw new RuntimeException(e);
		}
		return json;
	}
}
