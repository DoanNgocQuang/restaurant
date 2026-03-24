package com.ngocquang.restautant.modules.combo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

import com.ngocquang.restautant.modules.order.entity.OrderDetail;

@Entity
@Table(name = "combo")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Combo {

     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Integer id;

     @Column(nullable = false, length = 40)
     private String name;

     @Column(precision = 10, scale = 2, nullable = false)
     private BigDecimal price;

     @Column(columnDefinition = "Text", nullable = false)
     @Lob
     private String description;

     @Column(nullable = false)
     private String imageUrl;

     public enum Status {
          Available, Unavailable, Out_of_stock
     };

     @Enumerated(EnumType.STRING)
     @Column(nullable = false)
     private Status status = Status.Available;

     @OneToMany(mappedBy = "combo")
     private List<OrderDetail> orderDetails;

}