package com.ngocquang.restautant.modules.voucher.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.ngocquang.restautant.modules.voucher.entity.Voucher;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoucherResponse {
    private Integer id;
    private String code;
    private BigDecimal discountValue;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer quantity;
    private Voucher.DiscountType discountType;
    private Long usedUserCount;
}