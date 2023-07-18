//package com.krayon.backend.kakaopayAPI.controller;
//
//import com.krayon.backend.kakaopayAPI.controller.SampleController;
//import com.krayon.backend.kakaopayAPI.dto.PaymentDTO;
//import com.krayon.backend.kakaopayAPI.entity.KakaoPayApproval;
////import com.krayon.backend.kakaopayAPI.service.KakaoPay;
//import com.krayon.backend.kakaopayAPI.repository.PaymentRepository;
//import lombok.extern.java.Log;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@Log
//public class SampleController {
//
//    @Autowired
//    private KakaoPay kakaopay;
//
//    @Autowired
//    private PaymentRepository paymentRepository;
//
//    @PostMapping("/kakaoPay")
//    public String kakaoPay(@RequestParam("pod") String pod,
//                           @RequestParam("pud") String pud,
//                           @RequestParam("itemName") String itemName,
//                           @RequestParam("quantity") String quantity,
//                           @RequestParam("totalAmount") String totalAmount,
//                           @RequestParam("approvalUrl") String approvalUrl,
//                           @RequestParam("cancelUrl") String cancelUrl,
//                           @RequestParam("failUrl") String failUrl) {
//        log.info("kakaoPay post............................................");
//        return "redirect:" + kakaopay.kakaoPayReady(pod, pud, itemName, quantity, totalAmount, approvalUrl, cancelUrl, failUrl);
//    }
//
//    @GetMapping("/kakaoPaySuccess")
//    public ResponseEntity<?> kakaoPaySuccess(@RequestParam("pg_token") String pg_token) {
//        KakaoPayApproval approval = kakaopay.kakaoPayInfo(pg_token);
//        return ResponseEntity.ok().body(approval);
//    }
//}