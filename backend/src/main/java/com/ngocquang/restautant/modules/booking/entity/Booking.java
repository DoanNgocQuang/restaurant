package com.ngocquang.restautant.modules.booking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

import com.ngocquang.restautant.modules.order.entity.Order;
import com.ngocquang.restautant.modules.payment.entity.Invoice;
import com.ngocquang.restautant.modules.table.entity.resTable;
import com.ngocquang.restautant.modules.user.entity.User;

@Entity
@Table(name = "booking")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 15)
    private String contactPhone;

    @Column(nullable = false, length = 30)
    private String contactName;

    @Column(nullable = false)
    private LocalDateTime bookingTime;

    @Column(nullable = false)
    private Integer guestCount;

    @Column(nullable = false)
    private Integer durationMinutes = 120;

    @Column(nullable = false, columnDefinition = "TEXT")
    @Lob
    private String note;

    public enum Status {
        CONFIRMED, PENDING, CANCELLED
    }

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;

    @OneToMany(mappedBy = "booking")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Order> orders;

    @ManyToMany
    @JoinTable(name = "booked_table", joinColumns = @JoinColumn(name = "booking_id"), inverseJoinColumns = @JoinColumn(name = "table_id"))
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<resTable> tables;

    @OneToOne(mappedBy = "booking")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Invoice invoice;
}
