package com.ngocquang.restautant.modules.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class AdminOrderRequestDto {

    @NotNull(message = "Booking ID is required")
    private Integer bookingId;

    @NotEmpty(message = "Order must have at least 1 item")
    @Valid
    private List<OrderDetailCreateDto> orderDetails;
}
