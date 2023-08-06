package com.krayon.backend.user.repository;

import com.krayon.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String>{

    // 회원정보 조회
//    Optional<User> findById(String userId);
}
