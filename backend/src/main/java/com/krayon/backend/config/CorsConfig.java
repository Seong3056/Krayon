package com.krayon.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/socket/*")//어떤 요처엥 대해서
                .allowedOrigins("http://*:3000") //어떤 클라이언트를 허용할지
                .allowedMethods("*") //어떤요청방식을 허용할지
                .allowedHeaders("*") //어떤 요청헤더를 허용할지
                .allowCredentials(true)//쿠키전달을 허용할 것인지
                .maxAge(3600);
    }
}