package com.nhn_eat.back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nhn_eat.back.global.response.ApiResponse;
import com.nhn_eat.back.service.UserService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class UserController {

    private final UserService userService;

    @PostMapping("/api/v1/user/signup")
    public ResponseEntity<ApiResponse<String>> signup() {
        return ResponseEntity.ok().body(ApiResponse.success(userService.signup()));
    }
}
