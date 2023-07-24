package com.krayon.backend.wordmatch;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/match")
@CrossOrigin("http://localhost:3000")
public class WMController {

    private final WMService wmService;

    @GetMapping
    public ResponseEntity<?> getQuiz() {
        Map<String, String> wordFilter = wmService.wordFilter();

        if(wordFilter != null) {
            return ResponseEntity.ok().body(wordFilter);
        } else {
            log.info("randomWord를 찾을 수 없음: " + wordFilter);
            return ResponseEntity.notFound().build();
        }
    }
}
