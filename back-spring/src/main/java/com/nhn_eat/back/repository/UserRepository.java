package com.nhn_eat.back.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nhn_eat.back.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    UserEntity findByUuid(String uuid);
    boolean existsByUuid(String uuid);
}