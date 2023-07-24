package com.krayon.backend.kakaopayAPI.service;

import com.krayon.backend.kakaopayAPI.dto.userPaymentDTO;
import com.krayon.backend.kakaopayAPI.entity.KakaoPayApproval;
import com.krayon.backend.kakaopayAPI.entity.KakaoPayReady;
import com.krayon.backend.kakaopayAPI.dto.Payment;
import com.krayon.backend.kakaopayAPI.repository.PaymentRepository;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.UUID;

@Service
@Log
public class KakaoPay {

    private static final String HOST = "https://kapi.kakao.com";
    private KakaoPayReady kakaoPayReady;
    private KakaoPayApproval kakaoPayApproval;

    @Autowired
    private PaymentRepository paymentRepository;

    public KakaoPay(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public String kakaoPayReady(userPaymentDTO dto) {
        RestTemplate restTemplate = new RestTemplate();

        // Server request header
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "KakaoAK " + "9fcf41e2fcfb2edafc7d4de2bc9dcf83");
        headers.add("Accept", MediaType.APPLICATION_JSON_UTF8_VALUE);
        headers.add("Content-Type", MediaType.APPLICATION_FORM_URLENCODED_VALUE + ";charset=UTF-8");

        // Server request body

        UUID uuid = UUID.randomUUID();
        String pod = uuid.toString().substring(uuid.toString().lastIndexOf("-") + 1);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", "TC0ONETIME");
        params.add("partner_order_id", pod);
        params.add("partner_user_id", dto.getId());
        params.add("item_name", dto.getItemName());
        params.add("quantity", "1");
        params.add("total_amount", dto.getAmount());
        params.add("tax_free_amount", "0");
        params.add("approval_url", "http://localhost:8181/api/kakaoPaySuccess");
        params.add("cancel_url", "http://localhost:8181/api/kakaoPayCancel");
        params.add("fail_url", "http://localhost:8181/api/kakaoPayfail");

        HttpEntity<MultiValueMap<String, String>> body = new HttpEntity<>(params, headers);

        try {
            kakaoPayReady = restTemplate.postForObject(new URI(HOST + "/v1/payment/ready"), body, KakaoPayReady.class);
            log.info("" + kakaoPayReady);
            log.info(kakaoPayReady.getNext_redirect_pc_url());

            Payment payment = Payment.builder()
                    .tid(kakaoPayReady.getTid())
                    .pod(pod)
                    .pud(dto.getId())
                    .amount(dto.getAmount())
                    .build();
            Payment save = paymentRepository.save(payment);
            log.info(save.toString());

            return kakaoPayReady.getNext_redirect_pc_url();
        } catch (RestClientException | URISyntaxException e) {
            e.printStackTrace();
        }

        return "/pay";
    }


    public KakaoPayApproval kakaoPayInfo(String pg_token) {
        log.info("KakaoPayInfoVO............................................");
        log.info("-----------------------------");
        RestTemplate restTemplate = new RestTemplate();
        System.out.println("kakaoPayReadyVO.getTid() = " + kakaoPayReady.getTid());
        Payment payment = paymentRepository.findById(kakaoPayReady.getTid()).orElseThrow();
        System.out.println("paymentDTO = " + payment);
        String pod = payment.getPod();
        String pud = payment.getPud();
        String amount = payment.getAmount();
        // Server request header
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "KakaoAK " + "9fcf41e2fcfb2edafc7d4de2bc9dcf83");
        headers.add("Accept", MediaType.APPLICATION_JSON_UTF8_VALUE);
        headers.add("Content-Type", MediaType.APPLICATION_FORM_URLENCODED_VALUE + ";charset=UTF-8");

        // Server request body
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", "TC0ONETIME");
        params.add("tid", payment.getTid());
        params.add("partner_order_id", pod);
        params.add("partner_user_id", pud);
        params.add("pg_token", pg_token);
        params.add("total_amount", amount);

        HttpEntity<MultiValueMap<String, String>> body = new HttpEntity<>(params, headers);

        try {
            kakaoPayApproval = restTemplate.postForObject(new URI(HOST + "/v1/payment/approve"), body, KakaoPayApproval.class);
            log.info("" + kakaoPayApproval);
            //return KakaoPayApproval;
            return kakaoPayApproval;
        } catch (RestClientException | URISyntaxException e) {
            e.printStackTrace();
        }

        return null;
    }





}