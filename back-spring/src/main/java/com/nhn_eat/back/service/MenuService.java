package com.nhn_eat.back.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import com.nhn_eat.back.entity.MenuEntity;
import com.nhn_eat.back.dto.MenuResponseDTO;
import com.nhn_eat.back.entity.LikeEntity;
import com.nhn_eat.back.entity.UserEntity;
import com.nhn_eat.back.repository.MenuRepository;
import com.nhn_eat.back.repository.LikeRepository;
import com.nhn_eat.back.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuRepository menuRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;

    public List<String> getDates() {
        return menuRepository.findTop1000ByOrderByIdDesc().stream()
            .map(MenuEntity::getDate)
            .distinct()
            .collect(Collectors.toList());
    }

    public List<MenuResponseDTO> getMenus(String date, String uuid) {
        UserEntity user = userRepository.findByUuid(uuid);

        List<LikeEntity> likes = likeRepository.findByUserId(user.getId());

        return menuRepository.findByDate(date).stream()
            .map(menu -> {
                return new MenuResponseDTO(menu, likes.stream()
                    .filter(like -> like.getMenuId().equals(menu.getId()))
                    .count() > 0);
            })
            .collect(Collectors.toList());
    }

    public boolean likeMenu(Long menuId, String uuid) {
        UserEntity user = userRepository.findByUuid(uuid);
        LikeEntity like = new LikeEntity();
        like.setUserId(user.getId());
        like.setMenuId(menuId);
        likeRepository.save(like);

        MenuEntity menu = menuRepository.findById(menuId).orElseThrow(() -> new IllegalArgumentException("Menu not found"));
        menu.setLikeCount(menu.getLikeCount() + 1);
        menuRepository.save(menu);

        return true;
    }

    @Transactional
    public boolean unlikeMenu(Long menuId, String uuid) {
        UserEntity user = userRepository.findByUuid(uuid);
        likeRepository.deleteByUserIdAndMenuId(user.getId(), menuId);

        MenuEntity menu = menuRepository.findById(menuId).orElseThrow(() -> new IllegalArgumentException("Menu not found"));
        menu.setLikeCount(menu.getLikeCount() - 1);
        menuRepository.save(menu);

        return true;
    }
}
