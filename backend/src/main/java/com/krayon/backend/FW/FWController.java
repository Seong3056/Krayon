package com.krayon.backend.FW;


import com.krayon.backend.CM.CMService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/followWord")
public class FWController {

    private final FWService fwService;

    @PostMapping
    public ResponseEntity<?> checkDict(@RequestBody String searchWord){

        int result = fwService.checkWord(searchWord);
        if (result == 1) {
            return ResponseEntity.ok("OK");
        } else {
            return ResponseEntity.badRequest().body("Error");
        }
    }
}
