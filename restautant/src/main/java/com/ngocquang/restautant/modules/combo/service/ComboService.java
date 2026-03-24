package com.ngocquang.restautant.modules.combo.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ngocquang.restautant.common.helper.BadRequestException;
import com.ngocquang.restautant.common.helper.ResourceNotFoundException;
import com.ngocquang.restautant.modules.combo.dto.ComboRequest;
import com.ngocquang.restautant.modules.combo.dto.ComboResponse;
import com.ngocquang.restautant.modules.combo.entity.Combo;
import com.ngocquang.restautant.modules.combo.entity.ComboDetail;
import com.ngocquang.restautant.modules.combo.repository.ComboDetailRepository;
import com.ngocquang.restautant.modules.combo.repository.ComboRepository;
import com.ngocquang.restautant.modules.food.entity.Food;
import com.ngocquang.restautant.modules.food.repository.FoodRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ComboService {

    private final ComboRepository comboRepository;
    private final ComboDetailRepository comboDetailRepository;
    private final FoodRepository foodRepository;

    private ComboResponse toResponse(Combo combo) {
        List<ComboDetail> comboDetails = this.comboDetailRepository.findByComboId(combo.getId());

        List<ComboResponse.OutputFood> foods = comboDetails.stream()
                .map(detail -> new ComboResponse.OutputFood(
                        detail.getFood().getId(),
                        detail.getFood().getName()))
                .collect(Collectors.toList());

        return new ComboResponse(
                combo.getId(),
                combo.getName(),
                combo.getPrice(),
                combo.getDescription(),
                combo.getImageUrl(),
                combo.getStatus(),
                foods);
    }

    private void RequestToEntity(Combo combo, ComboRequest request) {
        combo.setName(request.getName());
        combo.setPrice(request.getPrice());
        combo.setDescription(request.getDescription());
        combo.setImageUrl(request.getImageUrl());
        combo.setStatus(request.getStatus() != null ? request.getStatus() : Combo.Status.Available);
    }

    private void validateFoods(List<ComboRequest.InputFood> foods) {
        if (foods == null || foods.isEmpty()) {
            throw new BadRequestException("Combo must contain at least one food item");
        }

        Set<Integer> foodIds = new HashSet<>();
        for (ComboRequest.InputFood food : foods) {
            if (!foodIds.add(food.getFoodId())) {
                throw new BadRequestException("A food item can only appear once in a combo");
            }
        }
    }

    private List<ComboDetail> FoodsToComboDetails(Combo combo, List<ComboRequest.InputFood> foods) {
        return foods.stream().map(inputFood -> {
            Food food = this.foodRepository.findById(inputFood.getFoodId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Food not found with id: " + inputFood.getFoodId()));

            ComboDetail comboDetail = new ComboDetail();
            comboDetail.setCombo(combo);
            comboDetail.setFood(food);
            comboDetail.setQuantity(1);
            return comboDetail;
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ComboResponse> getAllCombo() {
        return this.comboRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ComboResponse getComboById(Integer id) {
        Combo combo = this.comboRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Combo not found with id: " + id));
        return toResponse(combo);
    }

    @Transactional
    public ComboResponse createCombo(ComboRequest request) {
        validateFoods(request.getFoods());

        Combo combo = new Combo();
        RequestToEntity(combo, request);
        Combo savedCombo = this.comboRepository.save(combo);

        List<ComboDetail> comboDetails = FoodsToComboDetails(savedCombo, request.getFoods());
        this.comboDetailRepository.saveAll(comboDetails);

        return toResponse(savedCombo);
    }

    @Transactional
    public ComboResponse updateCombo(Integer id, ComboRequest request) {
        validateFoods(request.getFoods());

        Combo comboInDb = this.comboRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Combo not found with id: " + id));

        RequestToEntity(comboInDb, request);
        Combo savedCombo = this.comboRepository.save(comboInDb);

        this.comboDetailRepository.deleteByComboId(id);
        List<ComboDetail> comboDetails = FoodsToComboDetails(savedCombo, request.getFoods());
        this.comboDetailRepository.saveAll(comboDetails);

        return toResponse(savedCombo);
    }

    @Transactional
    public void deleteComboById(Integer id) {
        this.comboDetailRepository.deleteByComboId(id);
        this.comboRepository.deleteById(id);
    }
}