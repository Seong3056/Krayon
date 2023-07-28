package com.krayon.backend.socket.service;

import com.krayon.backend.socket.dto.FileDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
@RequiredArgsConstructor
public class FileService {
    public FileDTO create(MultipartFile file) {
        return null;
    }

    //insert, delete, select 필요
    
}
