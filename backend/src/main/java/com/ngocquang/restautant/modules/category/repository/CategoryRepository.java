package com.ngocquang.restautant.modules.category.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ngocquang.restautant.modules.category.entity.Category;


@Repository
public interface CategoryRepository extends JpaRepository<Category,Integer> {
}
