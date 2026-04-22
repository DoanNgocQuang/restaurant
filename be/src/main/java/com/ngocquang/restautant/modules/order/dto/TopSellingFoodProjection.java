package com.ngocquang.restautant.modules.order.dto;

import java.math.BigDecimal;

public interface TopSellingFoodProjection {
    Integer getFoodId();
    String getFoodName();
    BigDecimal getPrice();
    Long getTotalSold();
    BigDecimal getTotalRevenue();
}
