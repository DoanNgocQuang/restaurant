package com.ngocquang.restautant.modules.combo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.ngocquang.restautant.modules.food.entity.Food;

@Entity
@Table(name="combo_detail")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ComboDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "combo_id")
    private Combo combo;

    @ManyToOne
    @JoinColumn(name = "food_id")
    private Food food;

    @Column(nullable = false)
    private int quantity;
}