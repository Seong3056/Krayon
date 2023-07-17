package com.krayon.backend.korean;

import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;


@Service
@Slf4j
public class WordService {
	private final String SEARCH_URL = "https://opendict.korean.go.kr/api/search";
	private final String VIEW_URL = "https://opendict.korean.go.kr/api/view";
	private final String key = "BAAA5C2F46E8178AC1D5714D4775EAB5";
	private RestTemplate rt = new RestTemplate();

	public List<Map<String, String>> findWord(String searchWord) throws  IOException,  JSONException {
		List<Map<String, String>> wordList = new ArrayList<>();


		String encodedSearchWord = URLEncoder.encode(searchWord, StandardCharsets.UTF_8);
		String requestUrl = SEARCH_URL + "?key=" + key + "&req_type=json" + "&q=" + encodedSearchWord;
		log.info(requestUrl);
		URLConnection connection = new URL(requestUrl).openConnection();
		connection.setRequestProperty("Accept-Charset", StandardCharsets.UTF_8.toString());
		connection.connect();

		StringBuilder sb = new StringBuilder();
		try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
			String line;
			while ((line = reader.readLine()) != null) {
				sb.append(line);
			}
		}

		log.info(sb.toString());

		JSONObject json = new JSONObject(sb.toString());
		JSONObject channelObject = json.getJSONObject("channel");
		JSONArray itemArray = null;
		try {
			itemArray = channelObject.getJSONArray("item");
		} catch (Exception e) {
			return null;
		}

		for (int j = 0; j < itemArray.length(); j++) {
			Map<String, String> wordMap = new HashMap<>();
			JSONObject itemObject = itemArray.getJSONObject(j);

			// 수정: definition 필드가 없는 경우에 대한 처리
			JSONArray sense = itemObject.getJSONArray("sense");

				JSONObject senseObject = sense.getJSONObject(0);

				String definition = senseObject.optString("definition");
				String wordValue = itemObject.optString("word", "");
				String pos = senseObject.optString("pos");

				definition = definition.replace("^", " ").replace("_", " ");
				wordValue = wordValue.replace("^", " ").replace("_", " ");

				log.info("            " + definition);
				wordMap.put("definition", definition);
				wordMap.put("word", wordValue);
				wordMap.put("pos",pos);
				
				wordList.add(wordMap);
		}
		//생성된 단어리스트를 리턴
		return wordList;
	}
	public Map<String, String> randomWord()  {
		Random random = new Random();
		int r = (int) Math.floor(random.nextInt(100000) +1);

		String requestUrl = VIEW_URL + "?key=" + key +"&method=target_code"+ "&q="+r;
		log.info(requestUrl);
		StringBuilder sb = null;
		try {
			URLConnection connection = new URL(requestUrl).openConnection();
			connection.setRequestProperty("Accept-Charset", StandardCharsets.UTF_8.toString());
			connection.connect();

			sb = new StringBuilder();
			try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
				String line;
				while ((line = reader.readLine()) != null) {
					sb.append(line);
				}
			}
		} catch (IOException e) {
			return null;
		}

//		log.info(sb.toString());
		String replaceWord = null;
		String definition = null;
		try {
			JSONObject json = XML.toJSONObject(sb.toString());
			JSONObject channelObject = json.getJSONObject("channel");
			JSONObject item = channelObject.getJSONObject("item");

			JSONObject wordInfo = item.getJSONObject("wordInfo");
			String findWord = wordInfo.getString("word");
			replaceWord = findWord.replace("^"," ").replace("-"," ").replace("_"," ");


			JSONObject senseInfo = item.getJSONObject("senseInfo");
			definition = senseInfo.getString("definition");
		} catch (JSONException e) {
			return null;
		}

		Map<String,String > word = new HashMap<>();
		word.put("word",replaceWord);
		word.put("definition",definition);
		return word;
	}
	public static String getTagValue(String tag, Element eElement) {
		// 결과를 저장할 result 변수 선언
		String result = "";
		NodeList nodeList = eElement.getElementsByTagName(tag);
		if (nodeList != null && nodeList.getLength() > 0) {
			Node node = nodeList.item(0);
			if (node.getNodeType() == Node.ELEMENT_NODE) {
				Element element = (Element) node;
				result = element.getTextContent();
			}
		}
		return result;
	}
}



	// JSON 형식 유효성 검사 함수
//	private boolean isValidJson(String jsonStr) {
//		try {
//			new JSONObject(jsonStr);
//		} catch (JSONException ex) {
//			try {
//				new JSONArray(jsonStr);
//			} catch (JSONException ex1) {
//				return false;
//			}
//		}
//		return true;
//	}
//}
