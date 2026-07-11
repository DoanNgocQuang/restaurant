package com.ngocquang.restautant.modules.booking.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.ngocquang.restautant.modules.booking.entity.Booking;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingRequest {

    @NotBlank(message = "Contact phone is required")
    @Size(max = 15, message = "Contact phone must not exceed 15 characters")
    private String contactPhone;

    @NotBlank(message = "Contact name is required")
    @Size(max = 30, message = "Contact name must not exceed 30 characters")
    private String contactName;

    @NotNull(message = "Booking time is required")
    @FutureOrPresent(message = "Booking time must be in the present or future")
    private LocalDateTime bookingTime;

    @NotNull(message = "Guest count is required")
    @Min(value = 1, message = "Guest count must be at least 1")
    private Integer guestCount;

    private Integer durationMinutes;

    @NotBlank(message = "Note is required")
    private String note;

    private Booking.Status status;

    private Integer userId;

    @NotEmpty(message = "At least one table is required")
    private List<Integer> tableIds;
}