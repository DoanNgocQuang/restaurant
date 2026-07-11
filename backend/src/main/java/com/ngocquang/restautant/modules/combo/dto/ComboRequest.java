package com.ngocquang.restautant.modules.combo.dto;

import java.math.BigDecimal;
import java.util.List;

import com.ngocquang.restautant.modules.combo.entity.Combo;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComboRequest {

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

    private Combo.Status status;

    @Valid
    @NotNull(message = "Combo must contain at least one food item")
    private List<InputFood> foods;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InputFood {
        @NotNull(message = "Food ID is required")
        private Integer foodId;

        private String foodName;

        private Integer quantity;
    }
}