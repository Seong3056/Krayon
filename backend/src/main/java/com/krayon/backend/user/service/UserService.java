package com.krayon.backend.user.service;

import com.krayon.backend.auth.TokenProvider;
import com.krayon.backend.exception.DuplicatedUserIdException;
import com.krayon.backend.exception.NoRegisteredArgumentsException;
import com.krayon.backend.user.dto.request.LoginRequestDTO;
import com.krayon.backend.user.dto.request.UserRequestDTO;
import com.krayon.backend.user.dto.response.LoginResponseDTO;
import com.krayon.backend.user.dto.response.UserResponseDTO;
import com.krayon.backend.user.entity.User;
import com.krayon.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final TokenProvider tokenProvider;

    public UserResponseDTO create(final UserRequestDTO dto) throws RuntimeException {

        String userId = dto.getUserId();
        if(dto == null) {
            throw new NoRegisteredArgumentsException("가입 정보가 없습니다.");
        }

        if(isDuplicate(userId)) {
            throw new DuplicatedUserIdException("중복된 아이디 입니다.");
        }

        String encoded = encoder.encode(dto.getUserPw());
        dto.setUserPw(encoded);

        User user = dto.toEntity();

        User saved = userRepository.save(user);
        log.info(saved.toString());
        return new UserResponseDTO(saved);
    }

    public boolean isDuplicate(String userId) {
        return userRepository.existsById(userId);
    }

    public LoginResponseDTO authenticate(final LoginRequestDTO dto) {

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(
                        () -> new RuntimeException("가입된 회원이 아닙니다!")
                );

        String rawPassword = dto.getUserPw();
        log.info("rawPassword : " + rawPassword);
        String encodedPassword = user.getUserPw();
        log.info("encodedPassword : " + encodedPassword);

        if(!encoder.matches(rawPassword, encodedPassword)) {
            throw new RuntimeException("비밀번호가 틀렸습니다.");
        }

        String token = tokenProvider.createToken(user);

        return new LoginResponseDTO(user, token);
    }

    public UserResponseDTO delete(String userId) {
        try {
            userRepository.deleteById(userId);
        } catch (Exception e) {
            throw new RuntimeException("id가 존재하지 않아 삭제에 실패했습니다.");
        }
        return null;
    }
}