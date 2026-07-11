package com.ngocquang.restautant.modules.combo.dto;

import java.math.BigDecimal;
import java.util.List;

import com.ngocquang.restautant.modules.combo.entity.Combo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComboResponse {
    private Integer id;
    private String name;
    private BigDecimal price;
    private String description;
    private String imageUrl;
    private Combo.Status status;
    private List<OutputFood> foods;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OutputFood {
        private Integer foodId;
        private String foodName;
        private Integer quantity;
    }
}
