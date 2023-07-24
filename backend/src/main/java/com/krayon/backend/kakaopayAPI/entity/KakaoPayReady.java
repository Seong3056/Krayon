package com.krayon.backend.kakaopayAPI.entity;

import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.Date;


@Data
@Component
public class KakaoPayReady {
    private String tid;
    private String next_redirect_pc_url;
    private Date created_at;
}
