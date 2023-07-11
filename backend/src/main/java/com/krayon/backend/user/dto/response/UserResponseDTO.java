package com.krayon.backend.user.dto.response;

import com.krayon.backend.user.entity.User;
import lombok.*;

@Setter @Getter
@ToString
@NoArgsConstructor @AllArgsConstructor
@Builder
public class UserResponseDTO {

    private String userId;
    private String error;

    public UserResponseDTO(User user) {
        this.userId = user.getUserId();
    }
}
