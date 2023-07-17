package com.krayon.backend.koreanAPI.controller;
import com.krayon.backend.config.CorsConfig;
import com.krayon.backend.koreanAPI.service.OpenApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.apache.bcel.classfile.Module;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.w3c.dom.Node;

import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/searchWord")
@CrossOrigin("http://localhost:3000")
public class Controller {

    private final OpenApiService openAPIService;

    @GetMapping
    public ResponseEntity<List<Map<String, String>>> getWordsContaining(@RequestParam String searchWord) {
        if (searchWord == null || searchWord.isEmpty()) {
            return ResponseEntity.badRequest().build(); // 검색어가 비어있는 경우 400 Bad Request 반환
        }

        List<Map<String, String>> wordList = openAPIService.getWordsContaining(searchWord);
        if (!wordList.isEmpty()) {
            return ResponseEntity.ok().body(wordList);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}