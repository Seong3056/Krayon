package com.krayon.backend.koreanAPI.service;

import com.krayon.backend.koreanAPI.entity.Word;
import com.krayon.backend.koreanAPI.repository.WordRepository;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class OpenApiService {
    private static final String API_KEY = "BAAA5C2F46E8178AC1D5714D4775EAB5";
    private static final String BASE_URL = "https://opendict.korean.go.kr/api/search";

    private final WordRepository wordRepository;

    public OpenApiService(WordRepository wordRepository) {
        this.wordRepository = wordRepository;
    }

    public List<Map<String, String>> getWordsContaining(String searchWord, int page) {
        List<Map<String, String>> wordList = new ArrayList<>();

        try {
            String encodedSearchWord = URLEncoder.encode(searchWord, StandardCharsets.UTF_8.toString());
            String requestUrl = BASE_URL + "?key=" + API_KEY + "&q=" + encodedSearchWord + "&req_type=json"
                    + "&start=" + page ;  // Include the start and num parameters in the request URL
            log.info(requestUrl);
            URLConnection connection = new URL(requestUrl).openConnection();
            connection.setRequestProperty("Accept-Charset", StandardCharsets.UTF_8.toString());
            connection.connect();

            StringBuilder sb = new StringBuilder(); //sb는 URL에 대한 연결이 열리고 API응답을 읽고 호출. sb는 디버깅 목적으로 기록할 것
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    sb.append(line);
                }
            }

            log.info(sb.toString());

            if (isValidJson(sb.toString())) { //이 섹션은 JSON 형식의 API응답 데이터를 분석하고 단어 정의 및 단어 추출.
                JSONObject json = new JSONObject(sb.toString()); //isValiJsos -> 메서드를 활용하여 JSON데이터가 유효한지 확인
                JSONObject channelObject = json.getJSONObject("channel");

                // Check if the "item" key exists in the JSON response
                /*

                그런 다음 JSON 응답의 "channel" 개체에 키 "item"이 있는지 확인합니다.
                존재하지 않는 경우 검색어에 대해 일치하는 단어가 발견되지 않았음을 의미하며
                메서드는 빈 값을 반환합니다 -> 반환은 wordList로

                */
                if (!channelObject.has("item")) {
                    log.info("No matching words found for the search term");
                    return null;
                }


                JSONArray itemArray = channelObject.getJSONArray("item");
                if (itemArray.length() == 0) {
                    return null; // Return null when the itemArray is empty
                }

//"item" 키가 있는 경우 메서드는 JSON 응답에서 단어 배열을 검색하고 각 항목을 반복하여 단어 정의를 추출함.
                for (int j = 0; j < itemArray.length(); j++) {
                    //추출된 단어 정의와 단어는 월드맵에 추가될 것 -> 다시 wordList에 추가
                    Map<String, String> wordMap = new HashMap<>();
                    JSONObject itemObject = itemArray.getJSONObject(j);

                    JSONArray sense = itemObject.getJSONArray("sense");
                    for (int k = 0; k < sense.length(); k++) {
                        JSONObject senseObject = sense.getJSONObject(k);
                        String definition = senseObject.optString("definition");
                        String wordValue = itemObject.optString("word", "");

                        // Replace caret symbol (^) with underscore (_) and space
                        definition = definition.replace("^", "").replace("_", "").replace("<FL>", "").trim();
                        wordValue = wordValue.replace("^", "").replace("_", "").replace("<FL>", "").trim();

                        wordMap.put("definition", definition);
                        wordMap.put("word", wordValue);
                    }
                    wordList.add(wordMap);
                }
                return wordList;
            } else {
                log.error("Received data is not in valid JSON format");
                return wordList;
            }
        } catch (Exception e) {
            log.error("Error occurred while fetching data from OpenAPI", e);
        }
        return wordList;
    }

    public void saveWordsContaining(String searchWord) {
        int start = 1; // Provide a default value for start
        int num = 10; // Provide a default value for num
        List<Map<String, String>> wordList = getWordsContaining(searchWord, start);

        if (wordList != null && !wordList.isEmpty()) { // Check for null before attempting to save
            List<Word> wordsToSave = wordList.stream()
                    .map(wordMap -> {
                        Word wordEntity = new Word();
                        wordEntity.setId("testId");
                        wordEntity.setWord(wordMap.get("word"));
                        wordEntity.setDefinition(wordMap.get("definition"));
                        return wordEntity;
                    })
                    .collect(Collectors.toList());

//            wordRepository.saveAll(wordsToSave);
        }
    }

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