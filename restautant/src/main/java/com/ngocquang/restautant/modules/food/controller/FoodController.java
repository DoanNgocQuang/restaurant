package com.ngocquang.restautant.modules.food.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ngocquang.restautant.common.ApiResponse;
import com.ngocquang.restautant.modules.food.dto.FoodRequest;
import com.ngocquang.restautant.modules.food.dto.FoodResponse;
import com.ngocquang.restautant.modules.food.service.FoodService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Validated
@RestController
@RequestMapping("/foods")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FoodResponse>>> getAllFood(
            @RequestParam(required = false) String categoryName) {
        if (categoryName != null && !categoryName.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.success(foodService.getAllFoodWithCategory(categoryName),
                    "Fetched foods successfully"));
        }
        return ResponseEntity.ok(ApiResponse.success(foodService.getAllFood(), "Fetched foods successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FoodResponse>> getFoodById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(foodService.getFoodById(id), "Fetched food successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FoodResponse>> createFood(@Valid @RequestBody FoodRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(foodService.createFood(request), "Created food successfully", HttpStatus.CREATED.value()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FoodResponse>> updateFood(@PathVariable Integer id,
            @Valid @RequestBody FoodRequest request) {
        return ResponseEntity.ok(ApiResponse.success(foodService.updateFood(id, request), "Updated food successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteFood(@PathVariable Integer id) {
        this.foodService.deleteFood(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Deleted food successfully"));
    }
}