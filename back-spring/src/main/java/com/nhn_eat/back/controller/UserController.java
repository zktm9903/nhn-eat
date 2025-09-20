package com.nhn_eat.back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nhn_eat.back.global.response.ApiResponse;
import com.nhn_eat.back.service.UserService;

import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class UserController {

    private final UserService userService;

    @PostMapping("/api/v1/user/signup")
    public ResponseEntity<ApiResponse<String>> signup(HttpServletResponse response) {
        String uuid = userService.signup();
        
        // HttpOnly, SameSite 쿠키 설정 (무제한)
        response.setHeader("Set-Cookie", 
            String.format("auth-token=%s; Path=/; HttpOnly; SameSite=Lax", uuid));
        
        return ResponseEntity.ok().body(ApiResponse.success("회원가입이 완료되었습니다."));
    }
}
