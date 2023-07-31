
package com.krayon.backend.koreanAPI.service;


import com.krayon.backend.koreanAPI.entity.Word;
import com.krayon.backend.koreanAPI.repository.WordRepository;
import lombok.extern.slf4j.Slf4j;
import org.json.*;
import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;
import org.json.JSONObject;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import com.krayon.backend.config.CorsConfig;

import javax.transaction.Transactional;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;


@Service
@Slf4j
@Transactional
public class OpenApiService {
    private static final String API_KEY = "BAAA5C2F46E8178AC1D5714D4775EAB5";
    private static final String BASE_URL = "https://opendict.korean.go.kr/api/search";

    private final WordRepository wordRepository;

    public OpenApiService(WordRepository wordRepository) {
        this.wordRepository = wordRepository;
    }


    public List<Map<String, String>> getWordsContaining(String searchWord) { // API에서 지정된 검색어가 포함된 단어를 가져오는 역할을 함
        List<Map<String, String>> wordList = new ArrayList<>();

        try {
            String encodedSearchWord = URLEncoder.encode(searchWord, StandardCharsets.UTF_8.toString()); //인코딩된 검색어 및 요청 유형을 JSON으로 사용하여 요청 URL을 구성함
            String requestUrl = BASE_URL + "?key=" + API_KEY + "&q=" + encodedSearchWord + "&req_type=json";
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

            
              /*
              즉, 인코딩된 검색어 및 요청 유형을 JSON으로 사용하여 요청 URL을 구성함,
              API URL에 대한 연결을 열고 응답 데이터를 가져옴, 
              메서드 를 사용하여 응답 데이터가 유효한 JSON 형식인지 확인함,
              isValidJson은 응답 데이터가 유효한 JSON이면 JSON 데이터를 구문 분석하여 단어 정의를 추출하고 
              목록에 추가함,
              Map<String, String>은 각 맵에는 단어와 해당 정의가 포함되어 있음,
              응답 데이터가 유효한 JSON 형식이 아니거나 단어 정의가 없으면 빈 목록을 반환함
              */
            
            


            
            // JSON 형식을 확인하여 처리 -> isValidJson은 문자열에서 JSON 개체 및 배열을 생성하려고 시도하여 주어진 JSON문자열이 유효한 JSON형태인지 확인하는 메서드.
            //성공하면 트루, 아니면 폴스를 반환한다.
            if (isValidJson(sb.toString())) {
                JSONObject json = new JSONObject(sb.toString());
                //응답 데이터는 JSONObjectnamed 로 변환된 json을 channel사용하여 JSON에서 개체를 가져옴. json.getJSONObject("channel").
                JSONObject channelObject = json.getJSONObject("channel");
                JSONArray itemArray = channelObject.getJSONArray("item");
                //Map<String, String> wordMap = new HashMap<>();
                if (itemArray.length() == 0) {
                    return wordList;
                }
                //String definition = "";
                //String wordValue = "";
                for (int j = 0; j < itemArray.length(); j++) {
                    Map<String, String> wordMap = new HashMap<>();
                    JSONObject itemObject = itemArray.getJSONObject(j);
                    log.error(itemObject.toString());
                    // 수정: definition 필드가 없는 경우에 대한 처리
                    JSONArray sense = itemObject.getJSONArray("sense");
                    for (int k = 0; k < sense.length(); k++) {
                        JSONObject senseObject = sense.getJSONObject(k);
                        String definition = senseObject.optString("definition");
                        String wordValue = itemObject.optString("word", "");

                        // Replace caret symbol (^) with underscore (_)
                        // ...
                        // Replace caret symbol (^) with underscore (_) and space
                        definition = definition.replace("^", " ").replace("_", " ").replace("<FL>", "").trim();
                        wordValue = wordValue.replace("^", " ").replace("_", " ").replace("<FL>", "").trim();

                        log.info("            " + definition);
                        wordMap.put("definition", definition);
                        wordMap.put("word", wordValue);
                        log.info("+++++++++++++++++++++++" + wordMap.toString() + "+++++++++++++++++++++++");
                    }
                    wordList.add(wordMap);
                    log.info("================" + wordList.toString() + "==================");
                }
                return wordList;
            } else {
                // JSON 형식이 올바르지 않을 경우 처리
                // 예를 들어, 에러 메시지를 출력하거나 빈 결과를 반환할 수 있습니다.
                log.error("Received data is not in valid JSON format");
                // 수정: 빈 결과 반환
                return wordList;
            }
        } catch (Exception e) {
            log.error("Error occurred while fetching data from OpenAPI", e);
        }
        return wordList;
    }




    public void saveWordsContaining(String searchWord) {
        List<Map<String, String>> wordList = getWordsContaining(searchWord);

        if (!wordList.isEmpty()) {
            List<Word> wordsToSave = wordList.stream()
                    .map(wordMap -> {
                        Word wordEntity = new Word();
                        wordEntity.setId("testId");
                        wordEntity.setWord(wordMap.get("word"));
                        wordEntity.setDefinition(wordMap.get("definition"));
                        return wordEntity;
                    })
                    .collect(Collectors.toList());

            wordRepository.saveAll(wordsToSave);
        }
    }









    // JSON 형식 유효성 검사 함수
    private boolean isValidJson(String jsonStr) {
        try {
            new JSONObject(jsonStr);
        } catch (JSONException ex) {
            try {
                new JSONArray(jsonStr);
            } catch (JSONException ex1) {
                return false;
            }
        }
        return true;
    }
}
