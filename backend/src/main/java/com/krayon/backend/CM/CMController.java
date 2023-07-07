package com.krayon.backend.CM;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/catch")
public class CMController {

    private final CMService cMservice;

    @PostMapping
    public ResponseEntity<?> getSignal(@RequestBody Signal canvasData) {
        log.info(canvasData.toString());
        String data = canvasData.getCanvasData();
//        String draw = cMservice.getData(data);
        // 받은 데이터 처리 로직 수행
        log.info("받은 그림데이터: {}", data);

        // 응답 데이터 생성
//        String responseMessage = "데이터를 성공적으로 받았습니다.";
//        Signal responseData = new Signal(responseMessage);

//        return ResponseEntity.ok(responseData);
        return ResponseEntity.ok().body(canvasData);
    }


    @PostMapping("/chat")
    public ResponseEntity<?> getAnswer(@RequestBody Signal message){
        String msg = message.getMessage();
        log.info("받은 채팅: {}", msg);

//        String responseMessage = "데이터를 성공적으로 받았습니다.";
//        Signal responseData = new Signal(responseMessage);

//        return ResponseEntity.ok(responseData);
        return null;
    }
    @GetMapping
    public ResponseEntity<?> getQuiz(){

        String randomWord = cMservice.findRandomWord();

        if(randomWord != null){
            return  ResponseEntity.ok().body(randomWord);
        }
        else{
            return ResponseEntity.notFound().build();
        }
    }
}