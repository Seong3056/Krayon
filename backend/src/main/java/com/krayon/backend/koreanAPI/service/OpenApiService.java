
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


    public List<Map<String, String>> getWordsContaining(String searchWord) {
        List<Map<String, String>> wordList = new ArrayList<>();

        try {
            String encodedSearchWord = URLEncoder.encode(searchWord, StandardCharsets.UTF_8.toString());
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

            // JSON 형식을 확인하여 처리
            if (isValidJson(sb.toString())) {
                JSONObject json = new JSONObject(sb.toString());
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
