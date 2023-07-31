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
    public ResponseEntity<List<Map<String, String>>> getWordsContaining(
            @RequestParam String searchWord,
            @RequestParam int start // Provide a default value of 1 for start parameter
    ) {
        if (searchWord == null || searchWord.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Fetch API, db 저장
        openAPIService.saveWordsContaining(searchWord);

        // Fetch word list with paging parameters
        List<Map<String, String>> wordList = openAPIService.getWordsContaining(searchWord, start);
        if (!wordList.isEmpty()) {
            return ResponseEntity.ok().body(wordList);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
