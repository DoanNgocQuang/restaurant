package com.ngocquang.restautant.modules.food.dto;

import java.math.BigDecimal;

import com.ngocquang.restautant.modules.food.entity.Food;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodRequest {
    @NotBlank(message = "Name is required")
    @Size(max = 40, message = "Name must not exceed 40 characters")
    private String name;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    private Food.Status status;

    @NotNull(message = "Category is required")
    private Integer categoryId;
}