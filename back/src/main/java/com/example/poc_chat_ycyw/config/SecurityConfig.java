package com.example.poc_chat_ycyw.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Définition du filtre de sécurité HTTP
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/chat/**", "/ws/**").permitAll()  // autorise websocket pour SockJS
                        .anyRequest().authenticated()
                )
                .formLogin(Customizer.withDefaults())  // login formulaire
                .httpBasic(Customizer.withDefaults()) // auth HTTP Basic
                .csrf(AbstractHttpConfigurer::disable); // CSRF désactivé pour les WebSockets

        return http.build();
    }

    // Définition des utilisateurs en mémoire
    @Bean
    public UserDetailsService users(PasswordEncoder encoder) {
        UserDetails user1 = User.withUsername("user1")
                .password(encoder.encode("pass1"))
                .roles("USER")
                .build();

        UserDetails user2 = User.withUsername("user2")
                .password(encoder.encode("pass2"))
                .roles("USER")
                .build();

        return new InMemoryUserDetailsManager(user1, user2);
    }

    //  PasswordEncoder sécurisé (BCrypt)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
