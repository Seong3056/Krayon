package com.krayon.backend.FW;


import com.krayon.backend.CM.CMService;
import com.krayon.backend.korean.WordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/followWord")
public class FWController {

    private final FWService fwService;
    private final WordService w;

    @PostMapping
    public ResponseEntity<?> checkDict() throws ParserConfigurationException, IOException, SAXException, JSONException {
//        int result = fwService.checkWord(searchWord);

        List<Map<String, String>> aaa = w.findWord("소");
        Map<String, String> s = w.randomWord();
        log.info(s.toString());
//        log.info(aaa.toString());
        return ResponseEntity.ok().body(aaa);
//        if (result == 1) {
//            return ResponseEntity.ok("OK");
//        } else {
//            return ResponseEntity.badRequest().body("Error");
//        }

    }
}
