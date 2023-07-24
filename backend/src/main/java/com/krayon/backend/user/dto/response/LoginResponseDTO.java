package com.krayon.backend.user.dto.response;

import com.krayon.backend.user.entity.User;
import lombok.*;

@Getter
@Setter
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDTO {

    private String userId;

    public LoginResponseDTO(User user) {
        this.userId = user.getUserId();
    }

//    public LoginResponseDTO(User user) {
//        this.userId = user.getUserId();
//    }
}
