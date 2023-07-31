package com.krayon.backend.socket.api;

import com.krayon.backend.socket.dto.FileRequestDTO;
import com.krayon.backend.socket.dto.FileResponseDTO;
import com.krayon.backend.socket.service.FileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/save")
@CrossOrigin
public class FileController {

    private final FileService fileService;

    //img 파일 저장 요청 받기
    @PostMapping
    public ResponseEntity<?> save(

            @RequestBody FileRequestDTO dto

    ) {

log.info(dto.toString());
        FileResponseDTO fileDto = fileService.create(dto);
        return null;

    }


}
