package com.nhn_eat.back.dto;

import com.nhn_eat.back.entity.MealType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MenuResponseDTO {
    private Long id;
    private String name;
    private String description;
    private int calories;
    private MealType mealType;
    private String imageUrl;
    private boolean isLunchBox;
    private String date;
    private int likeCount;
    private boolean isLiked;
    
    public MenuResponseDTO(com.nhn_eat.back.entity.MenuEntity menu, boolean isLiked) {
        this.id = menu.getId();
        this.name = menu.getName();
        this.description = menu.getDescription();
        this.calories = menu.getCalories();
        this.mealType = menu.getMealType();
        this.imageUrl = menu.getImageUrl();
        this.isLunchBox = menu.isLunchBox();
        this.date = menu.getDate();
        this.likeCount = menu.getLikeCount();
        this.isLiked = isLiked;
    }
} 