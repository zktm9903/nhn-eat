package com.nhn_eat.back.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nhn_eat.back.entity.LikeEntity;

public interface LikeRepository extends JpaRepository<LikeEntity, Long> {
    List<LikeEntity> findByUserId(Long userId);
    void deleteByUserIdAndMenuId(Long userId, Long menuId);
}
