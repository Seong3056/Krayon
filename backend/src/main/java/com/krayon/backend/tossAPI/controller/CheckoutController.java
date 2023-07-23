package com.krayon.backend.tossAPI.controller;

import com.krayon.backend.tossAPI.request.PaymentRequest;
import com.krayon.backend.tossAPI.response.PaymentResponse;
import com.krayon.backend.tossAPI.service.CheckoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController //http요청처리하고 다시 응답보낼꺼임.
@RequestMapping("/api/checkout")
@CrossOrigin(origins = "http://localhost:5173")
public class CheckoutController { //결제 관련 HTTP 요청을 처리할 클래스

    private final CheckoutService checkoutService;

    @Autowired
    public CheckoutController(CheckoutService checkoutService) { //CheckoutService 매개변수 받을거임
        this.checkoutService = checkoutService;
    }

    @PostMapping("/process-payment")
    public ResponseEntity<PaymentResponse> processPayment(@RequestBody PaymentRequest paymentRequest) {   //이 메서드는 결제 처리 요청을 처리하기 위한 진입점. PaymentRequestJSON 요청 본문에서 역직렬화되는 개체를 입력으로함.
        try { //기본 결제 처리 로직 시작
            // Call the payment processing service to handle the payment logic
            boolean paymentSuccess = checkoutService.processPayment(paymentRequest); //실제 결제 로직을 처리하기 위해 processPayment의 메서드를 호출함. 개체를 매개 변수로 checkoutService 전달함.

            if (paymentSuccess) {
                PaymentResponse response = new PaymentResponse(); //프론트로 다시 보낼 응답을 작성하는데 사용할 객체
                response.setSuccess(true); //지불이 성공했음을 나타내도록 설정
                response.setMessage("Payment successful"); //결제 상태에 대한 추가 정보를 제공하기 위해 message의 필드를 "결제 성공"으로 설정함.
                return ResponseEntity.ok(response);
            } else {
                PaymentResponse response = new PaymentResponse();
                response.setSuccess(false);
                response.setMessage("Payment failed");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            // Handle any exceptions or errors
            PaymentResponse response = new PaymentResponse();
            response.setSuccess(false); //지불이 실패하면 false겠지
            response.setMessage("An error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response); //PaymentResponse오류 상태 및 메시지를 포함하는 개체 와 함께 HTTP 500 내부 서버 오류 응답을 반환함.
        }
    }
}
