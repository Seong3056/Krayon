package com.krayon.backend;

//import ch.qos.logback.core.net.SyslogOutputStream;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
import com.krayon.backend.kakaopayAPI.dto.Payment;
import com.krayon.backend.kakaopayAPI.repository.PaymentRepository;
import com.krayon.backend.user.dto.request.UserRequestDTO;
import com.krayon.backend.user.entity.User;
import com.krayon.backend.user.repository.UserRepository;
import org.junit.Test;

import org.junit.jupiter.api.DisplayName;
import org.springframework.boot.test.context.SpringBootTest;


@SpringBootTest
class BackendApplicationTests {
	String name = "test";
	String pw = "aaaa1111!";

	UserRepository userRepository;

	@Test
	@DisplayName("회원가입")
	public void joinTest() {
	    //given
	    User userTest = User.builder().userId(name).userPw(pw).build();
	    //when
		User save = userRepository.save(userTest);
		//then
		System.out.println("save = " + save);
	}
}
