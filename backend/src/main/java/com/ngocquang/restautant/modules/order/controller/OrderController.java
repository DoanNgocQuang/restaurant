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

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getAllOrders() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        orderService.getAllOrders(),
                        "Fetched all orders successfully"
                )
        );
    }

    @GetMapping("/top-foods")
    public ResponseEntity<ApiResponse<List<com.ngocquang.restautant.modules.order.dto.TopSellingFoodProjection>>> getTopSellingFoods(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year
    ) {
        if (month == null || year == null) {
            java.time.LocalDate now = java.time.LocalDate.now();
            month = month == null ? now.getMonthValue() : month;
            year = year == null ? now.getYear() : year;
        }

        return ResponseEntity.ok(
                ApiResponse.success(
                        orderService.getTopSellingFoods(month, year),
                        "Fetched top selling foods successfully"
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

    @PostMapping("/admin")
    public ResponseEntity<ApiResponse<OrderDto>> createOrderForAdmin(
            @Valid @RequestBody com.ngocquang.restautant.modules.order.dto.AdminOrderRequestDto request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        orderService.createOrderForAdmin(request),
                        "Admin created order successfully",
                        HttpStatus.CREATED.value()
                ));
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<ApiResponse<OrderDto>> updateOrderForAdmin(
            @PathVariable Integer id,
            @Valid @RequestBody com.ngocquang.restautant.modules.order.dto.AdminOrderRequestDto request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        orderService.updateOrderForAdmin(id, request),
                        "Admin updated order successfully"
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteOrder(@PathVariable Integer id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok(
                ApiResponse.success(
                        null,
                        "Admin deleted order successfully"
                )
        );
    }
}