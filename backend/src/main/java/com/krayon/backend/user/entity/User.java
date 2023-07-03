package com.krayon.backend.user.entity;

import lombok.*;

@Getter
@Setter
@ToString
@EqualsAndHashCode(of = "")
@NoArgsConstructor
@AllArgsConstructor
@Builder
//@Entity
//@Table(name = "user")
public class User {
	private String userId;
	private String userPw;
}
