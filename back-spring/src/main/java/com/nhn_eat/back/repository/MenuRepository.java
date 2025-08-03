package com.nhn_eat.back.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.nhn_eat.back.entity.MenuEntity;

@Repository
public interface MenuRepository extends JpaRepository<MenuEntity, Long> {
    boolean existsByNameAndDate(String name, String date);
    List<MenuEntity> findByDate(String date);
    List<MenuEntity> findByNameAndDate(String name, String date);
}
