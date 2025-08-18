package com.nhn_eat.back.filter;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.nhn_eat.back.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UuidAuthenticationFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return path.startsWith("/public") || path.equals("/api/v1/user/signup");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String uuid = null;

        // Authorization 헤더에서 uuid 추출
        String authorization = request.getHeader("Authorization");
        if (authorization != null && authorization.startsWith("Bearer ")) {
            uuid = authorization.substring(7); // "Bearer " 제거
        }

        // uuid가 없거나 DB에 없으면 401 반환
        if (uuid == null || !userRepository.existsByUuid(uuid)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized: Invalid UUID");
            return;
        }

        // 인증 성공 시 SecurityContext에 Authentication 설정
        UsernamePasswordAuthenticationToken authToken = 
            new UsernamePasswordAuthenticationToken(uuid, null, null);
        SecurityContextHolder.getContext().setAuthentication(authToken);

        // 정상일 경우 다음 필터로 진행
        filterChain.doFilter(request, response);
    }
}
