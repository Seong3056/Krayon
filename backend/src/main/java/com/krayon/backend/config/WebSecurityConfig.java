//package com.krayon.backend.config;
//
//import com.krayon.backend.filter.JwtAuthFilter;
//import lombok.RequiredArgsConstructor;
//import org.springframework.context.annotation.Bean;
//import org.springframework.http.HttpMethod;
//import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.web.filter.CorsFilter;
//
//@EnableWebSecurity
//@RequiredArgsConstructor
//@EnableGlobalMethodSecurity(prePostEnabled = true)
//public class WebSecurityConfig {
//
//    private final JwtAuthFilter jwtAuthFilter;
//
//    @Bean
//    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
//
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http
//                .cors()
//                .and()
//                .csrf().disable()
//                .httpBasic().disable()
//                .sessionManagement()
//                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//                .and()
//                .authorizeRequests()
//                .antMatchers("/", "/api/krayon/**").permitAll()
//                .anyRequest().authenticated();
//
//        http.addFilterAfter(
//                jwtAuthFilter,
//                CorsFilter.class
//        );
//
//        return http.build();
//
//    }
//
//}
