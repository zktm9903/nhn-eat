package com.nhn_eat.back.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.nhn_eat.back.entity.MenuEntity;
import com.nhn_eat.back.entity.MealType;
import com.nhn_eat.back.repository.MenuRepository;

@Service
public class CrawlingService {

    @Autowired
    private MenuRepository menuRepository;

    public List<String> getPossibleDates() {
        String url = "https://menu.payco.com/mrc/818490";
        try {
            Document doc = Jsoup.connect(url).get();
            Elements dateElements = doc.select(".option.btnSelSvcYmd");
            List<String> dates = new ArrayList<>();
            dateElements.forEach(element -> dates.add(element.text().trim()));

            System.out.println("가능한 날짜 목록: " + dates);
            return dates;
        } catch (IOException e) {
            System.err.println("크롤링 중 오류 발생: " + e.getMessage());
        }

        return null;
    }


    public List<MenuEntity> getMenus(String date) {
        String url = "https://menu.payco.com/service/shopMenu/menuList.nhn?shopMenuCfgSeq=29&serviceYmd=" + date.replaceAll("-", "");
        List<MenuEntity> menus = new ArrayList<>();
        
        try {
            Document doc = Jsoup.connect(url).get();
            Elements menuElements = doc.select(".list_menu .item_menu");
            
            for (Element element : menuElements) {
                // 메뉴 이름 추출
                String name = element.select(".menu_title").text().trim();
                
                // 메뉴 설명 추출 및 처리
                String descriptionHtml = element.select(".menu_desc").html().trim();
                String description = processDescription(descriptionHtml);
                
                // 칼로리 추출
                String caloriesText = element.select(".menu_cal").text().trim();
                int calories = extractCalories(caloriesText);
                
                // 카테고리 추출
                String category = element.select(".menu_category").text().trim();
                
                // 이미지 URL 추출
                String imageUrl = element.select(".menu_img_box img").attr("src");
                if (imageUrl != null && imageUrl.startsWith("http:")) {
                    imageUrl = imageUrl.replace("http:", "https:");
                }
                
                // MealType 결정
                MealType mealType = determineMealType(category);
                
                // 도시락 여부 확인
                boolean isLunchBox = category.contains("도시락");
                
                // MenuEntity 생성
                MenuEntity menu = new MenuEntity();
                menu.setName(name);
                menu.setDescription(isLunchBox ? "" : description);
                menu.setCalories(calories);
                menu.setMealType(mealType);
                menu.setImageUrl(imageUrl);
                menu.setLunchBox(isLunchBox);
                menu.setDate(date);
                
                menus.add(menu);
            }
            
            System.out.println("크롤링된 메뉴 개수: " + menus.size());
            System.out.println(menus);
            return menus;
            
        } catch (IOException e) {
            System.err.println("크롤링 중 오류 발생: " + e.getMessage());
            return menus;
        }
    }
    
    private String processDescription(String descriptionHtml) {
        if (descriptionHtml == null || descriptionHtml.isEmpty()) {
            return "";
        }
        
        // HTML을 텍스트로 변환하고 처리
        String description = descriptionHtml
            .replaceAll("\n", "")
            .replaceAll("&amp;", "&")
            .replaceAll("<br>", ", ");
            
        // HTML 태그 제거
        description = description.replaceAll("<[^>]*>", "");
        
        // 마지막 쉼표들 제거
        if (description.endsWith(", ")) {
            description = description.substring(0, description.length() - 2);
        }
        
        return description.trim();
    }
    
    private int extractCalories(String caloriesText) {
        if (caloriesText == null || caloriesText.isEmpty()) {
            return 0;
        }
        
        // 숫자만 추출
        String numbers = caloriesText.replaceAll("[^0-9]", "");
        if (numbers.isEmpty()) {
            return 0;
        }
        
        try {
            return Integer.parseInt(numbers);
        } catch (NumberFormatException e) {
            return 0;
        }
    }
    
    private MealType determineMealType(String category) {
        if (category.contains("중식")) {
            return MealType.LUNCH;
        } else if (category.contains("석식")) {
            return MealType.DINNER;
        } else {
            return MealType.LUNCH; // 기본값
        }
    }

    // @Scheduled(fixedRate = 5000)
    public void syncMenu() {
        List<String> dates = this.getPossibleDates();
        for (String date : dates) {
            List<MenuEntity> crawlingMenus = this.getMenus(date).stream()
                .distinct()
                .collect(Collectors.toList());
            List<MenuEntity> previousMenus = menuRepository.findByDate(date);
            List<MenuEntity> noNeedMenus = previousMenus.stream()
                .filter(menu -> !crawlingMenus.contains(menu))
                .collect(Collectors.toList());
            List<MenuEntity> needUpdateMenus = previousMenus.stream()
                .filter(menu -> crawlingMenus.contains(menu))
                .collect(Collectors.toList());
            List<MenuEntity> newMenus = crawlingMenus.stream()
                .filter(menu -> !previousMenus.contains(menu))
                .collect(Collectors.toList());
            
            for (MenuEntity menu : noNeedMenus) {
                menuRepository.delete(menu);
            }
            for (MenuEntity newMenu : needUpdateMenus) {
                List<MenuEntity> existingMenus = menuRepository.findByNameAndDate(
                    newMenu.getName(), newMenu.getDate());

                if (existingMenus.size() > 0) {
                    MenuEntity menu = existingMenus.get(0);
                    menu.setDescription(newMenu.getDescription());
                    menu.setCalories(newMenu.getCalories());
                    menu.setImageUrl(newMenu.getImageUrl());
                    menu.setLunchBox(newMenu.isLunchBox());
                    menu.setLikeCount(0);
                    menuRepository.save(menu);
                } else {
                    menuRepository.save(newMenu);
                }
            }
            for (MenuEntity menu : newMenus) {
                menuRepository.save(menu);
            }
        }

    }
} 