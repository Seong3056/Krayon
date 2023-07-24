//package com.krayon.backend.kakaopayAPI.service;
//
//import com.krayon.backend.kakaopayAPI.entity.Amount;
//import com.krayon.backend.kakaopayAPI.entity.Card;
//import com.krayon.backend.kakaopayAPI.entity.KakaoPayApproval;
//import com.krayon.backend.kakaopayAPI.entity.KakaoPayReady;
//import com.krayon.backend.kakaopayAPI.dto.PaymentDTO;
//import com.krayon.backend.kakaopayAPI.repository.PaymentRepository;
//import lombok.extern.java.Log;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpEntity;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.MediaType;
//import org.springframework.stereotype.Service;
//import org.springframework.util.LinkedMultiValueMap;
//import org.springframework.util.MultiValueMap;
//import org.springframework.web.client.RestClientException;
//import org.springframework.web.client.RestTemplate;
//
//import java.net.URI;
//import java.net.URISyntaxException;
//
//@Service
//@Log
//public class KakaoPay {
//
//    private static final String HOST = "https://kapi.kakao.com";
//    private KakaoPayReady kakaoPayReady;
//    private KakaoPayApproval kakaoPayApproval;
//
//    @Autowired
//    private PaymentRepository paymentRepository;
//
//    public KakaoPay(PaymentRepository paymentRepository) {
//        this.paymentRepository = paymentRepository;
//    }
//
//    public String kakaoPayReady(String pod, String pud, String itemName, String quantity, String totalAmount,
//                                String approvalUrl, String cancelUrl, String failUrl) {
//        RestTemplate restTemplate = new RestTemplate();
//
//        // Server request header
//        HttpHeaders headers = new HttpHeaders();
//        headers.add("Authorization", "KakaoAK " + "9fcf41e2fcfb2edafc7d4de2bc9dcf83");
//        headers.add("Accept", MediaType.APPLICATION_JSON_UTF8_VALUE);
//        headers.add("Content-Type", MediaType.APPLICATION_FORM_URLENCODED_VALUE + ";charset=UTF-8");
//
//        // Server request body
//        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
//        params.add("cid", "TC0ONETIME");
//        params.add("partner_order_id", pod);
//        params.add("partner_user_id", pud);
//        params.add("item_name", itemName);
//        params.add("quantity", quantity);
//        params.add("total_amount", totalAmount);
//        params.add("tax_free_amount", "100");
//        params.add("approval_url", approvalUrl);
//        params.add("cancel_url", cancelUrl);
//        params.add("fail_url", failUrl);
//
//        HttpEntity<MultiValueMap<String, String>> body = new HttpEntity<>(params, headers);
//
//        try {
//            kakaoPayReady = restTemplate.postForObject(new URI(HOST + "/v1/payment/ready"), body, KakaoPayReady.class);
//            log.info("" + kakaoPayReady);
//            log.info(kakaoPayReady.getNext_redirect_pc_url());
//
//            PaymentDTO paymentDTO = PaymentDTO.builder()
//                    .tid(kakaoPayReady.getTid())
//                    .pod(pod)
//                    .pud(pud)
//                    .amount(totalAmount)
//                    .build();
//            PaymentDTO save = paymentRepository.save(paymentDTO);
//            log.info(save.toString());
//
//            return kakaoPayReady.getNext_redirect_pc_url();
//        } catch (RestClientException | URISyntaxException e) {
//            e.printStackTrace();
//        }
//
//        return "/pay";
//    }
//
//
//    public KakaoPayApproval kakaoPayInfo(String pg_token) {
//        log.info("KakaoPayInfoVO............................................");
//        log.info("-----------------------------");
//        RestTemplate restTemplate = new RestTemplate();
//        System.out.println("kakaoPayReadyVO.getTid() = " + kakaoPayReady.getTid());
//        PaymentDTO paymentDTO = paymentRepository.findById(kakaoPayReady.getTid()).orElseThrow();
//        System.out.println("paymentDTO = " + paymentDTO);
//        String pod = paymentDTO.getPod();
//        String pud = paymentDTO.getPud();
//        String amount = paymentDTO.getAmount();
//        // Server request header
//        HttpHeaders headers = new HttpHeaders();
//        headers.add("Authorization", "KakaoAK " + "9fcf41e2fcfb2edafc7d4de2bc9dcf83");
//        headers.add("Accept", MediaType.APPLICATION_JSON_UTF8_VALUE);
//        headers.add("Content-Type", MediaType.APPLICATION_FORM_URLENCODED_VALUE + ";charset=UTF-8");
//
//        // Server request body
//        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
//        params.add("cid", "TC0ONETIME");
//        params.add("tid", paymentDTO.getTid());
//        params.add("partner_order_id", pod);
//        params.add("partner_user_id", pud);
//        params.add("pg_token", pg_token);
//        params.add("total_amount", amount);
//
//        HttpEntity<MultiValueMap<String, String>> body = new HttpEntity<>(params, headers);
//
//        try {
//            kakaoPayApproval = restTemplate.postForObject(new URI(HOST + "/v1/payment/approve"), body, KakaoPayApproval.class);
//            log.info("" + kakaoPayApproval);
//            //return KakaoPayApproval;
//            return kakaoPayApproval;
//        } catch (RestClientException | URISyntaxException e) {
//            e.printStackTrace();
//        }
//
//        return null;
//    }
//
//
//
//
//
//}