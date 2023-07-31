package com.krayon.backend.socket.service;

import com.krayon.backend.socket.dto.FileRequestDTO;
import com.krayon.backend.socket.dto.FileResponseDTO;
import com.krayon.backend.socket.entity.File;
import com.krayon.backend.socket.repository.FileRepository;
import com.krayon.backend.user.dto.request.UserRequestDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
@RequiredArgsConstructor
public class FileService {

    private final FileRepository fileRepository;

    //insert, delete, select 필요
    public FileResponseDTO create(FileRequestDTO dto) {


        File f = new File().toEntity(dto);
        File saved = fileRepository.save(f);

        return new FileResponseDTO(saved);
    }


    
}
