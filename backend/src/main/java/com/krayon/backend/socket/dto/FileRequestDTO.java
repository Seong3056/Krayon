package com.krayon.backend.socket.dto;

import com.krayon.backend.socket.entity.File;
import lombok.*;

@Setter
@Getter
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileRequestDTO {

    //파일 변환 필요
    private String word;

    private String img;

    public File toEntity(String fileSource) {
        return File.builder()
                .word(this.word)
                .img(fileSource)
                .build();
    }

}
