package com.ngocquang.restautant.modules.food.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ngocquang.restautant.common.helper.BadRequestException;
import com.ngocquang.restautant.common.helper.ResourceNotFoundException;
import com.ngocquang.restautant.modules.category.dto.CategoryResponse;
import com.ngocquang.restautant.modules.category.entity.Category;
import com.ngocquang.restautant.modules.category.repository.CategoryRepository;
import com.ngocquang.restautant.modules.food.dto.FoodRequest;
import com.ngocquang.restautant.modules.food.dto.FoodResponse;
import com.ngocquang.restautant.modules.food.entity.Food;
import com.ngocquang.restautant.modules.food.repository.FoodRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FoodService {

    private final FoodRepository foodRepository;
    private final CategoryRepository categoryRepository;

    private FoodResponse toResponse(Food food) {
        return FoodResponse.builder()
                .id(food.getId())
                .name(food.getName())
                .price(food.getPrice())
                .description(food.getDescription())
                .imageUrl(food.getImageUrl())
                .status(food.getStatus())
                .category(CategoryResponse.builder()
                        .id(food.getCategory().getId())
                        .name(food.getCategory().getName())
                        .build())
                .build();
    }

    private Category resolveCategory(Integer categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
    }

    private void RequestToEntity(Food food, FoodRequest request) {
        food.setName(request.getName());
        food.setPrice(request.getPrice());
        food.setDescription(request.getDescription());
        food.setImageUrl(request.getImageUrl());
        food.setStatus(request.getStatus() != null ? request.getStatus() : Food.Status.AVAILABLE);
        food.setCategory(resolveCategory(request.getCategoryId()));
    }

    public List<FoodResponse> getAllFood() {
        return this.foodRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<FoodResponse> getAllFoodWithCategory(String categoryName) {
        return this.foodRepository.findByCategory_Name(categoryName).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public FoodResponse getFoodById(Integer id) {
        Food food = this.foodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food not found with id: " + id));
        return toResponse(food);
    }

    public FoodResponse createFood(FoodRequest request) {
        if (foodRepository.existsByName(request.getName())) {
            throw new BadRequestException("Food with name '" + request.getName() + "' already exists");
        }
        Food food = new Food();
        RequestToEntity(food, request);
        return toResponse(foodRepository.save(food));
    }

    public FoodResponse updateFood(Integer id, FoodRequest request) {
        Food food = this.foodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food not found with id: " + id));
        if (!food.getName().equalsIgnoreCase(request.getName())
                && foodRepository.existsByName(request.getName())) {
            throw new BadRequestException("Food with name '" + request.getName() + "' already exists");
        }
        RequestToEntity(food, request);
        return toResponse(foodRepository.save(food));
    }

    public void deleteFood(Integer id) {
        Food food = this.foodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food not found with id: " + id));
        this.foodRepository.delete(food);
    }
}
