package com.ngocquang.restautant.modules.table.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import com.ngocquang.restautant.modules.booking.entity.Booking;

@Entity
@Table(name = "res_table")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class resTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    @Lob
    private String description;

    @Column(nullable = false)
    private int capacity;

    public enum Status {
        AVAILABLE, OCCUPIED, RESERVED
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.AVAILABLE;

    @Column
    private LocalDateTime reservedAt;

    @Column
    private LocalDateTime occupiedAt;

    @ManyToMany(mappedBy = "tables")
    private List<Booking> bookings;

}
