package com.ngocquang.restautant.modules.payment.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.ngocquang.restautant.modules.booking.entity.Booking;
import com.ngocquang.restautant.modules.voucher.entity.Voucher;

@Entity
@Table(name="invoice")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucher_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Voucher voucher;

    @OneToOne(mappedBy = "invoice")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Payment payment;

    @OneToOne
    @JoinColumn(name="booking_id",unique = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Booking booking;
}
