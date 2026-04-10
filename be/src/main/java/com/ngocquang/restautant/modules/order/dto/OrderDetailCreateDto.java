package com.ngocquang.restautant.modules.order.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDetailCreateDto {

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be greater than 0")
    private Integer quantity;

    private Integer foodId;

    private Integer comboId;

    @AssertTrue(message = "Must choose food OR combo only")
    private boolean isValidItemChoice() {
        boolean hasFoodId = foodId != null;
        boolean hasComboId = comboId != null;
        return hasFoodId != hasComboId;
    }
}