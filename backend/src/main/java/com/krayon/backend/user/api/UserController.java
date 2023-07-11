package com.krayon.backend.user.api;

import com.krayon.backend.auth.TokenUserInfo;
import com.krayon.backend.exception.NoRegisteredArgumentsException;
import com.krayon.backend.user.dto.request.LoginRequestDTO;
import com.krayon.backend.user.dto.request.UserRequestDTO;
import com.krayon.backend.user.dto.response.LoginResponseDTO;
import com.krayon.backend.user.dto.response.UserResponseDTO;
import com.krayon.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/krayon")
public class UserController {

    private final UserService userService;

    @PostMapping
    // 회원 가입 요청 처리
    public ResponseEntity<?> join(
            @Validated @RequestBody UserRequestDTO dto, BindingResult result
    ) {
        log.info(dto.toString());
        if(result.hasErrors()) {
            log.warn(result.toString());
            return ResponseEntity.badRequest().body(result.getFieldError());
        }

        try {
            UserResponseDTO responseDTO = userService.create(dto);
            return ResponseEntity.ok().body(responseDTO);
        }
        catch (NoRegisteredArgumentsException e) {
            log.warn("필수 가입 정보를 전달받지 못했습니다.");
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        catch (Exception e) {
            log.warn("기타 예외가 발생했습니다.");
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Validated @RequestBody LoginRequestDTO dto, BindingResult result) {

        try {
            LoginResponseDTO responseDTO = userService.authenticate(dto);
            return ResponseEntity.ok().body(responseDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUser(
            @AuthenticationPrincipal TokenUserInfo userInfo
    ) {
        log.info("DELETE 할 id : " + userInfo);

        if(userInfo == null) {
            return ResponseEntity.badRequest().body(UserResponseDTO.builder().error("ID를 전달해 주세요"));
        }

        try {
            UserResponseDTO responseDTO = userService.delete(userInfo.getUserId());
            return ResponseEntity.ok().body(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(UserResponseDTO.builder().error(e.getMessage()));
        }
    }
}