package com.ngocquang.restautant.modules.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderCreateDto {

    @NotEmpty(message = "Order must have at least 1 item")
    @Valid
    private List<OrderDetailCreateDto> orderDetails;
}