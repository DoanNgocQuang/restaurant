package com.ngocquang.restautant.modules.food.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

import com.ngocquang.restautant.modules.category.entity.Category;
import com.ngocquang.restautant.modules.order.entity.OrderDetail;

@Entity
@Table(name="food")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Food {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false,length=40)
    private String name;

    @Column(precision = 15,scale =2,nullable = false)
    private BigDecimal price;

    @Column(columnDefinition = "Text",nullable = false)
    @Lob
    private String description;

    @Column(nullable = false)
    private String imageUrl;

    public enum Status{AVAILABLE,UNAVAILABLE,OUT_OF_STOCK};

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status=Status.AVAILABLE;

    @OneToMany(mappedBy = "food")
    private List<OrderDetail> orderDetails;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="category_id", nullable = false)
    private Category category;
}

