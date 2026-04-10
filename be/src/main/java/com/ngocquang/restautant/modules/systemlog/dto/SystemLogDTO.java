package com.ngocquang.restautant.modules.systemlog.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemLogDTO {

    private Integer id;

    private String action;

    private String detail;

    private LocalDateTime loggedAt;

    private Integer userId;

    private String userEmail;
}