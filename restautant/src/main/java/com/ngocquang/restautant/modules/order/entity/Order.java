package com.ngocquang.restautant.modules.order.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.ngocquang.restautant.modules.booking.entity.Booking;
import com.ngocquang.restautant.modules.user.entity.User;

@Entity
@Table(name="orders")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false,updatable = false)
    private LocalDateTime created_at=LocalDateTime.now();

    @Column(nullable = false,precision = 12,scale = 2)
    private BigDecimal total_amount;

    public enum Status{Cart,Confirmed,Pending,Cancelled}

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status=Status.Pending;

    @OneToMany(mappedBy = "order")
    private List<OrderDetail> orderDetails;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="booking_id")
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User user;
}
