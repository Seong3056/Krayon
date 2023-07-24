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
public class UserResponseDTO {

    private String userId;

    public UserResponseDTO(User user) {
        this.userId = user.getUserId();
    }
}
