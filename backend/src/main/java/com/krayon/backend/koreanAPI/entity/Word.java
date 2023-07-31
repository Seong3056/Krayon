package com.krayon.backend.koreanAPI.entity;

import lombok.*;

import javax.persistence.*;

@Getter @Setter @ToString
@EqualsAndHashCode(of = "word")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "bookmark")
public class Word {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    @Column(name = "word", nullable = false)
    private String word;

    @Column(columnDefinition = "TEXT")
    private String definition;


}