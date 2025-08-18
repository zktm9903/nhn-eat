package com.nhn_eat.back.service;

import org.springframework.stereotype.Service;

import com.nhn_eat.back.entity.UserEntity;
import com.nhn_eat.back.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;

    public String signup() {
        UserEntity user = new UserEntity();
        String uuid = java.util.UUID.randomUUID().toString();
        user.setUuid(uuid);
        userRepository.save(user);
        return uuid;
    }
}
