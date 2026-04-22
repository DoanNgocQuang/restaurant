package com.ngocquang.restautant.modules.checkout.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckoutRequestDto {

    @NotNull(message = "Order ID cannot be null")
    private Integer orderId;

    @NotBlank(message = "Payment method cannot be blank")
    private String paymentMethod;

    private String voucherCode;
}
