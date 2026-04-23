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


@Entity
@Table(name="payment")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    public enum Method{CASH,BANK_TRANSFER};
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Method method=Method.CASH;

    @Column(nullable = false,precision = 12,scale = 2)
    private BigDecimal amount;

    @Column(nullable = false,updatable = false)
    private LocalDateTime paidAt=LocalDateTime.now();

    @OneToOne
    @JoinColumn(name="invoice_id",unique = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Invoice invoice;
}
