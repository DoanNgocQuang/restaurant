package com.ngocquang.restautant.modules.food.dto;

import java.math.BigDecimal;
import com.ngocquang.restautant.modules.category.dto.CategoryResponse;
import com.ngocquang.restautant.modules.food.entity.Food;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodResponse {
    private Integer id;
    private String name;
    private BigDecimal price;
    private String description;
    private String imageUrl;
    private Food.Status status;
    private CategoryResponse category;
}
