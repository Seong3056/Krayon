package com.krayon.backend.koreanAPI.repository;


import com.krayon.backend.koreanAPI.entity.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WordRepository extends JpaRepository<Word, Long> {
}
