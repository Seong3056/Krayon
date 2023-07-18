package com.krayon.backend.socket.util;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.micrometer.core.lang.Nullable;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import javax.websocket.Session;
import java.util.*;


@Slf4j
@Component
public class ConversionJson {

	public String conversion(String state, Set<Session> clients,  String ...field){
		StringBuilder sb = new StringBuilder();
		Map<String,Object> map = new HashMap<>();

		//접속중인 유저들을 리스트에 담는다.
		Set<String> idList = new HashSet<>();
//		JSONPObject json = new JSONPObject(idList);
				clients.forEach(a -> {
			 String id = a.getRequestParameterMap().get("id").get(0);
			 idList.add(id);

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
		log.info(sb.toString());
		return json;
	}
	public String conversionWord (String id, String date,@Nullable String word,@Nullable String definition, @Nullable String pos,boolean flag){
		Map<String,Object> map = new HashMap<>();

		map.put("name",id);
		map.put("date",date);


		Map<String,Object> wordMap = new HashMap<>(); // word 객체 생성
		wordMap.put("word",word);
		wordMap.put("definition",definition);
		wordMap.put("pos",pos);
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
}
