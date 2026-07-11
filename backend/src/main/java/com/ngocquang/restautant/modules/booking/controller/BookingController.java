package com.ngocquang.restautant.modules.booking.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ngocquang.restautant.common.ApiResponse;
import com.ngocquang.restautant.modules.booking.dto.BookingRequest;
import com.ngocquang.restautant.modules.booking.dto.BookingResponse;
import com.ngocquang.restautant.modules.booking.service.BookingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Validated
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings(
            @RequestParam(required = false) Integer userId) {
        return ResponseEntity.ok(
                ApiResponse.success(this.bookingService.getAllBookings(userId), "Fetched bookings successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(@PathVariable Integer id) {
        return ResponseEntity
                .ok(ApiResponse.success(this.bookingService.getBookingById(id), "Fetched booking successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(@Valid @RequestBody BookingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(this.bookingService.createBooking(request),
                        "Created booking successfully", HttpStatus.CREATED.value()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBooking(@PathVariable Integer id,
            @Valid @RequestBody BookingRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success(this.bookingService.updateBooking(id, request), "Updated booking successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteBooking(@PathVariable Integer id) {
        this.bookingService.deleteBooking(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Deleted booking successfully"));
    }

    @GetMapping("/my-current")
    public ResponseEntity<ApiResponse<BookingResponse>> getMyCurrentBooking() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        bookingService.getMyCurrentBooking(),
                        "Fetched current booking successfully"));
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<ApiResponse<BookingResponse>> confirmBooking(@PathVariable Integer id) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        bookingService.confirmBooking(id),
                        "Booking confirmed successfully"));
    }
}