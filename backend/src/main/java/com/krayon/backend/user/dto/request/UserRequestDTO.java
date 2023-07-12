package com.krayon.backend.user.dto.request;

import com.krayon.backend.user.entity.User;
import lombok.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Setter @Getter
@ToString
@NoArgsConstructor @AllArgsConstructor
@Builder
public class UserRequestDTO {

    @NotBlank
    private String userId;

    @NotBlank
    @Size(min = 8, max = 20)
    private String userPw;

    public User toEntity() {
        return User.builder()
                .userId(this.userId)
                .userPw(this.userPw)
                .build();
    }
}
