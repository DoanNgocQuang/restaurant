package com.ngocquang.restautant.modules.category.service;

import com.ngocquang.restautant.common.helper.ResourceNotFoundException;
import com.ngocquang.restautant.modules.category.dto.CategoryCreateDTO;
import com.ngocquang.restautant.modules.category.dto.CategoryResponse;
import com.ngocquang.restautant.modules.category.entity.Category;
import com.ngocquang.restautant.modules.category.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // GET ALL
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    public CategoryResponse getCategoryById(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        return mapToDto(category);
    }

    // CREATE
    @Transactional
    public CategoryResponse createCategory(CategoryCreateDTO dto) {

        Category category = Category.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .build();

        category = categoryRepository.save(category);

        return mapToDto(category);
    }

    @Transactional
    public CategoryResponse updateCategory(Integer id, CategoryCreateDTO dto) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        category.setName(dto.getName());
        category.setDescription(dto.getDescription());

        category = categoryRepository.save(category);

        return mapToDto(category);
    }

    @Transactional
    public void deleteCategory(Integer id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        categoryRepository.delete(category);
    }

    private CategoryResponse mapToDto(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())

                .foodCount(category.getFoods() != null ? category.getFoods().size() : 0)

                .build();
    }
}