package com.krayon.backend.user.entity;

import lombok.*;

import javax.persistence.*;


@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder

@EqualsAndHashCode(of="userId")
@Entity
@Table(name = "user")
public class User {

	@Id
	private String userId;

	@Column(nullable = false)
	private String userPw;
}
