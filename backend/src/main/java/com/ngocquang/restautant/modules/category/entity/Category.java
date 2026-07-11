package com.ngocquang.restautant.modules.category.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import com.ngocquang.restautant.modules.food.entity.Food;

@Entity
@Table(name="category")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false,length = 20)
    private String name;

    @Column(columnDefinition = "TEXT",nullable = false)
    @Lob
    private String description;

    @OneToMany(mappedBy = "category")
    private List<Food> foods;
}
