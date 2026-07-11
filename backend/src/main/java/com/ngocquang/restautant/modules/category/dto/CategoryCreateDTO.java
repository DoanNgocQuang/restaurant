package com.ngocquang.restautant.modules.category.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryCreateDTO {

    @NotBlank(message = "Category name is required")
    @Size(max = 20, message = "Name must not exceed 20 characters")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;
}