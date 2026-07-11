package com.ngocquang.restautant.modules.category.controller;

import com.ngocquang.restautant.common.ApiResponse;
import com.ngocquang.restautant.modules.category.dto.CategoryCreateDTO;
import com.ngocquang.restautant.modules.category.dto.CategoryResponse;
import com.ngocquang.restautant.modules.category.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        categoryService.getAllCategories(),
                        "Fetched categories successfully"
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Integer id) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        categoryService.getCategoryById(id),
                        "Fetched category successfully"
                )
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @Valid @RequestBody CategoryCreateDTO request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        categoryService.createCategory(request),
                        "Created category successfully",
                        HttpStatus.CREATED.value()
                ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable Integer id,
            @Valid @RequestBody CategoryCreateDTO request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        categoryService.updateCategory(id, request),
                        "Updated category successfully"
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Integer id) {
        categoryService.deleteCategory(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        null,
                        "Deleted category successfully"
                )
        );
    }
}