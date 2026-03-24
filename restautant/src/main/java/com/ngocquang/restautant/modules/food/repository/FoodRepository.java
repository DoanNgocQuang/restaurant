package com.ngocquang.restautant.modules.food.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ngocquang.restautant.modules.food.entity.Food;

@Repository
public interface FoodRepository extends JpaRepository<Food, Integer> {
    boolean existsByName(String name);

    List<Food> findByCategory_Name(String name);
}