package com.krayon.backend.socket.entity;

import com.krayon.backend.socket.dto.FileRequestDTO;
import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Getter
@ToString
@EqualsAndHashCode(of = "word")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "file")
public class File {

    //DB 생성 필요
    @Id
    private int fid;

    @Column
    private String word;

    @Column
    private String img;

public File toEntity(FileRequestDTO dto){
      return File.builder().word(dto.getWord()).img(dto.getImg()).build();

}


}
