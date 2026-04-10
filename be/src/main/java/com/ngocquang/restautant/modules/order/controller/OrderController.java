package com.ngocquang.restautant.modules.order.controller;

import com.ngocquang.restautant.common.ApiResponse;
import com.ngocquang.restautant.modules.order.dto.OrderCreateDto;
import com.ngocquang.restautant.modules.order.dto.OrderDto;
import com.ngocquang.restautant.modules.order.entity.OrderStatus;
import com.ngocquang.restautant.modules.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderDto>> createOrder(
            @Valid @RequestBody OrderCreateDto request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        orderService.createOrder(request),
                        "Created order successfully",
                        HttpStatus.CREATED.value()
                ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderById(@PathVariable Integer id) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        orderService.getOrderById(id),
                        "Fetched order successfully"
                )
        );
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getMyOrders() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        orderService.getOrdersByUser(),
                        "Fetched user orders successfully"
                )
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderDto>> updateStatus(
            @PathVariable Integer id,
            @RequestParam OrderStatus status
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        orderService.updateStatus(id, status),
                        "Updated order status successfully"
                )
        );
    }
}