package com.ngocquang.restautant.modules.category.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class CategoryResponse {

    private Integer id;
    private String name;
    private String description;

    private Integer foodCount;
}
