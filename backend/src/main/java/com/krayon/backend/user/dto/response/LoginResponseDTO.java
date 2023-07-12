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
    private String token;

//    public LoginResponseDTO(User user, String token) {
//        this.userId = user.getUserId();
//        this.token = token;
//    }

    public LoginResponseDTO(User user) {
        this.userId = user.getUserId();
    }
}
