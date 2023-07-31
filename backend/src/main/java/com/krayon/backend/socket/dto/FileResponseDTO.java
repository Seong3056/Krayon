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
public class FileResponseDTO {

    private String word;

    private String img;

    public FileResponseDTO(File file) {
        this.word = file.getWord();
        this.img = file.getImg();
    }

}
