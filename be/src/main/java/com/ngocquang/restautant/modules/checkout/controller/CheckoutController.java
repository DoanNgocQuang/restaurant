package com.ngocquang.restautant.modules.checkout.controller;

import com.ngocquang.restautant.common.ApiResponse;
import com.ngocquang.restautant.modules.checkout.dto.CheckoutRequestDto;
import com.ngocquang.restautant.modules.checkout.service.CheckoutService;
import com.ngocquang.restautant.modules.order.dto.OrderDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    private final CheckoutService checkoutService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderDto>> processCheckout(
            @Valid @RequestBody CheckoutRequestDto request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        checkoutService.processCheckout(request),
                        "Checkout completed successfully"
                )
        );
    }
}
