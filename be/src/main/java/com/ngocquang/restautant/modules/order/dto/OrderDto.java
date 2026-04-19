package com.ngocquang.restautant.modules.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.ngocquang.restautant.modules.order.entity.OrderStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDto {

    private Integer id;
    private LocalDateTime createdAt;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private Integer bookingId;
    private Integer userId;
    private String userName;
    private String userEmail;
    private String tablesName;

    private List<OrderDetailDto> orderDetails;
}