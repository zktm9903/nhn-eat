package com.nhn_eat.back.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nhn_eat.back.dto.MenuResponseDTO;
import com.nhn_eat.back.global.response.ApiResponse;
import com.nhn_eat.back.service.MenuService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor    
@RequestMapping("/api/v1/menu")
public class MenuController {

    private final MenuService menuService;

    @GetMapping("")
    public ResponseEntity<ApiResponse<List<MenuResponseDTO>>> getMenus(@RequestParam String date, @AuthenticationPrincipal String uuid) {
        return ResponseEntity.ok().body(ApiResponse.success(menuService.getMenus(date, uuid)));
    }

    @GetMapping("/dates")
    public ResponseEntity<ApiResponse<List<String>>> getDates() {
        return ResponseEntity.ok().body(ApiResponse.success(menuService.getDates()));
    }

    @PostMapping("/like")
    public ResponseEntity<ApiResponse<Boolean>> likeMenu(@RequestParam Long menuId, @AuthenticationPrincipal String uuid) {
        return ResponseEntity.ok().body(ApiResponse.success(menuService.likeMenu(menuId, uuid)));
    }

    @DeleteMapping("/like")
    public ResponseEntity<ApiResponse<Boolean>> unlikeMenu(@RequestParam Long menuId, @AuthenticationPrincipal String uuid) {
        return ResponseEntity.ok().body(ApiResponse.success(menuService.unlikeMenu(menuId, uuid)));
    }

}
