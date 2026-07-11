package com.ngocquang.restautant.modules.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDetailDto {

    private Integer id;
    private Integer quantity;
    private BigDecimal price;
    private Integer orderId;
    private Integer foodId;
    private Integer comboId;
    private String itemName;
}