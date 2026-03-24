package com.ngocquang.restautant.modules.user.dto;

import java.time.LocalDateTime;

import com.ngocquang.restautant.modules.user.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private int id;
    private String fullname;
    private String email;
    private String phone;
    private User.Role role;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
