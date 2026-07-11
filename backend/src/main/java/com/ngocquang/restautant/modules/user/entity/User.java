package com.ngocquang.restautant.modules.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import com.ngocquang.restautant.modules.booking.entity.Booking;
import com.ngocquang.restautant.modules.comment.entity.Comment;
import com.ngocquang.restautant.modules.systemlog.entity.SystemLog;
import com.ngocquang.restautant.modules.voucher.entity.VoucherDetail;

@Entity
@Table(name="users")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false,length = 100)
    private String fullname;

    @Column(nullable = false,length = 100,unique = true)
    private String email;

    @Column(length = 15,nullable=false)
    private String phone;

    @Column(nullable = false,length=255)
    private String password;

    public enum Role{CUSTOMER,ADMIN}

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role =Role.CUSTOMER;

    @Column(nullable = false)
    private Boolean is_active=Boolean.TRUE;

    @Column(nullable = false,updatable = false)
    private LocalDateTime created_at=LocalDateTime.now();

    @OneToMany(mappedBy = "user")
    private List<SystemLog> systemLogs;

    @OneToMany(mappedBy = "user")
    private List<VoucherDetail> voucherDetails;

    @OneToMany(mappedBy = "user")
    private List<Booking> bookings;

    @OneToMany(mappedBy = "user")
    private List<Comment> comments;

}
