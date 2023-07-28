package com.krayon.backend.socket.api;

import com.krayon.backend.socket.dto.FileDTO;
import com.krayon.backend.socket.service.FileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@CrossOrigin
public class FileController {

    private final FileService fileService;

    //img 파일 저장 요청 받기
    @PostMapping
    public ResponseEntity<?> save(@Validated @RequestPart(value = "img", required = false) MultipartFile fileImg) {
        FileDTO fileDto = fileService.create(fileImg);
        return null;

    }


}
