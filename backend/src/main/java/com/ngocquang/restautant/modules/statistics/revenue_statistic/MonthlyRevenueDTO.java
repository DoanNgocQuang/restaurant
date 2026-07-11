package com.ngocquang.restautant.modules.statistics.revenue_statistic;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyRevenueDTO {

    private String month;
    private Long totalInvoices;
    private Long totalGuests;
    private BigDecimal totalRevenue;
}
