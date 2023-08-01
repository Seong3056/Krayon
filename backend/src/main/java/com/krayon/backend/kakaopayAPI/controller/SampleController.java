package com.krayon.backend.kakaopayAPI.controller;

import com.krayon.backend.kakaopayAPI.dto.userPaymentDTO;
import com.krayon.backend.kakaopayAPI.entity.KakaoPayApproval;
//import com.krayon.backend.kakaopayAPI.service.KakaoPay;
import com.krayon.backend.kakaopayAPI.repository.PaymentRepository;
import com.krayon.backend.kakaopayAPI.service.KakaoPay;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.UUID;

@RestController
@Log
@RequestMapping("/api")
public class SampleController {

    @Autowired
    private KakaoPay kakaopay;

    @Autowired
    private PaymentRepository paymentRepository;

    @GetMapping("/uuid")
    public String test(){
        UUID uuid = UUID.randomUUID();
        return uuid.toString().substring(uuid.toString().lastIndexOf("-")+1);
    }
    @PostMapping("/kakaoPay")
    public ResponseEntity<?> kakaoPay(@RequestBody userPaymentDTO dto) {
        log.info("kakaoPay post............................................"+dto.toString());
        String result = kakaopay.kakaoPayReady(dto);
        log.info(result);

        return ResponseEntity.ok().body(result);
    }
    @GetMapping("/kakaoPaySuccess")
    public ResponseEntity<?> kakaoPaySuccess(@RequestParam("pg_token") String pg_token) {
        KakaoPayApproval approval = kakaopay.kakaoPayInfo(pg_token);
        SimpleDateFormat format = new SimpleDateFormat("yyyy년MM월dd일ahh시mm분");



        return ResponseEntity.ok().body("<div style=\"font-size:30px; margin-left:20px\">결제가 성공적으로 진행됐습니다.<br/>" +
                        "결제금액: " + approval.getAmount().getTotal()+ "<br/>"+
                        "구독 만료일: "+ format.format(approval.getExpire_at())+
                        " </div>"
                );
    }
    @GetMapping("/kakaoPayCancel")
    public ResponseEntity<?> kakaoPayCancel() {
        log.info("결제취소");
        return ResponseEntity.ok().body("결제를 취소");
    }
    @GetMapping("/kakaoPayFail")
    public ResponseEntity<?> kakaoPayFail() {

        return ResponseEntity.badRequest().body("결제실패");
    }
}