package com.krayon.backend;

import com.krayon.backend.user.entity.User;
import com.krayon.backend.user.repository.UserRepository;
import org.junit.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Rollback(false)
public
class BackendApplicationTest {
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