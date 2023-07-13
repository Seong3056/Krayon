package com.krayon.backend.socket.service;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import javax.websocket.Session;
import java.util.*;


@Slf4j
@Component
public class ConversionJson {

	public String conversion(String state, Set<Session> clients, String ...field){
		StringBuilder sb = new StringBuilder();
		Map<String,Object> map = new HashMap<>();


		Set<String> idList = new HashSet<>();
//		JSONPObject json = new JSONPObject(idList);
				clients.forEach(a -> {
			 String id = a.getRequestParameterMap().get("id").get(0);
			 idList.add(id);

		 });
		map.put("name",field[0]);
		map.put("date",field[1]);
		map.put("msg",field[0]+"님이 접속했습니다.");
		map.put("list",idList);
		ObjectMapper mapper = new ObjectMapper();
		String json = "";
		try {
			json = mapper.writeValueAsString(map);
		} catch (JsonProcessingException e) {
			throw new RuntimeException(e);
		}


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
				sb.append("{\"name\":\"");
				sb.append(field[0]);
				sb.append("\",\"date\":\"");
				sb.append(field[1]);
				sb.append("\",\"msg\":\"");
				sb.append(field[0]);
				sb.append("님이 접속했습니다.\"");
				sb.append(",\"list\":");
				sb.append(Arrays.toString(idList.toArray()));
				sb.append("}");
				break;
			case "close":
				sb.append("{\"name\":\"");
				sb.append(field[0]);
				sb.append("\",\"date\":\"");
				sb.append(field[1]);
				sb.append("\",\"msg\":\"");
				sb.append(field[0]);
				sb.append("님이 나갔습니다.\"");
				sb.append(",\"list\":");
				sb.append("[");
				sb.append(Arrays.toString(idList.toArray()));
				sb.append("]");
				sb.append("}");
				break;
				
		}
		
		log.info(sb.toString());
		return json;
	}
}
